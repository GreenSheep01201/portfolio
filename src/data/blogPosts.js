export const blogPosts = [
  {
    id: 'polyglot-persistence',
    title: 'MRP 시스템 개발기: Polyglot Persistence 패턴 적용',
    date: '2025. 11. 25',
    tags: ['Express', 'MySQL', 'MSSQL', 'Architecture'],
    excerpt: 'ERP 데이터는 MSSQL에서, 웹 애플리케이션 데이터는 MySQL에서 관리하는 Polyglot Persistence 패턴을 적용하며 배운 점을 정리합니다.',
    content: `
## 문제 상황

자재소요계획(MRP) 시스템을 개발하면서 까다로운 요구사항을 마주했습니다. 기존 MES(Manufacturing Execution System)의 데이터는 MSSQL에 있었고, 새로 개발하는 웹 애플리케이션은 MySQL을 사용해야 했습니다.

## 왜 두 개의 DB를 써야 했나

1. **기존 MES 데이터 (MSSQL)**
   - BOM(Bill of Materials) 마스터
   - 재고 데이터 및 생산 실적
   - 저장 프로시저를 통한 데이터 조회

2. **웹 앱 데이터 (MySQL)**
   - FCST(Forecast) 및 생산계획 데이터
   - 사용자 관리 및 역할 기반 접근 제어
   - 캐싱 테이블 및 감사 로그

## 구현 아키텍처

\`\`\`javascript
// 서버에서 두 개의 커넥션 풀 관리
const mssqlPool = new mssql.ConnectionPool({
  server: process.env.MSSQL_HOST,
  database: process.env.MSSQL_DATABASE,
  options: { encrypt: false, trustServerCertificate: true }
});

const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  database: 'mrp_rpa',
  connectionLimit: 10
});
\`\`\`

### MSSQL 저장 프로시저 활용

기존 MES 시스템의 저장 프로시저를 그대로 활용했습니다:

\`\`\`javascript
// BOM 전개 조회
const bomResult = await mssqlPool.request()
  .input('MATNR', sql.VarChar, partNo)
  .execute('UP_P1428_SELECT_NET');

// 현재고 조회
const stockResult = await mssqlPool.request()
  .input('WERKS', sql.VarChar, plant)
  .execute('UP_P9410_SELECT_NET');
\`\`\`

## 시행착오

### 1. 트랜잭션의 한계

두 DB에 걸친 트랜잭션은 구현할 수 없었습니다. 생산계획 저장 시 MySQL에 계획을 저장하고, MSSQL에서 BOM을 조회해야 했는데, 중간에 실패하면 롤백이 어려웠습니다.

**해결책**:

\`\`\`javascript
// 보상 트랜잭션 패턴 적용
try {
  // 1. MySQL에 생산계획 저장
  await mysqlPool.query('INSERT INTO fcst_data ...', [data]);

  // 2. MSSQL에서 BOM 검증
  const bomValid = await validateBOM(data.partNo);

  if (!bomValid) {
    // 보상: MySQL 데이터 롤백
    await mysqlPool.query('DELETE FROM fcst_data WHERE id = ?', [newId]);
    throw new Error('BOM 검증 실패');
  }
} catch (error) {
  // 감사 로그에 실패 기록
  await logFailure(error, data);
}
\`\`\`

### 2. 데이터 동기화 이슈

MES에서 재고가 변경되어도 웹 앱에서 즉시 반영되지 않는 문제가 있었습니다.

**해결책**: 캐싱 전략과 TTL 설정

\`\`\`javascript
// reverse_planning_cache 테이블 활용
// TTL: 1시간, 수동 갱신 가능
const cachedData = await mysqlPool.query(
  'SELECT * FROM reverse_planning_cache WHERE part_no = ? AND updated_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)',
  [partNo]
);
\`\`\`

### 3. 쿼리 성능 차이

MSSQL과 MySQL의 쿼리 최적화 방식이 달라서 동일한 로직도 다르게 작성해야 했습니다.

## 성능 최적화

- **커넥션 풀링**: MSSQL(max:10), MySQL(max:10)
- **인덱스 전략**: \`part_no\`, \`production_date\`, \`team\` 기준
- **파티셔닝**: \`production_date\` 기준 월별 파티션

## 배운 점

1. Polyglot Persistence는 레거시 시스템 통합에 유용하지만, 복잡도가 크게 증가한다.
2. 트랜잭션 불가능한 상황에서는 보상 트랜잭션과 감사 로그가 필수다.
3. 캐싱 전략 없이는 두 DB 간 데이터 정합성 유지가 어렵다.
    `
  },
  {
    id: 'bom-reverse-planning',
    title: 'BOM 역전개 알고리즘: 중간재고 차감과 부족수량 산출',
    date: '2025. 11. 20',
    tags: ['Algorithm', 'MRP', 'React', 'JavaScript'],
    excerpt: 'MRP 시스템의 핵심인 BOM 역전개 로직을 구현하며 겪었던 시행착오와 중간재고 차감 알고리즘을 설명합니다.',
    content: `
## BOM 역전개란?

일반적인 BOM 전개가 "완제품 → 부품"으로 내려가는 것이라면, 역전개는 "부품 → 이 부품이 사용되는 상위 제품들"을 찾아 올라가는 것입니다.

## 핵심 과제

특정 부품의 소요량을 계산할 때, 단순히 "생산계획 × BOM 수량"이 아니라 **중간 반제품의 재고**를 고려해야 했습니다.

### 예시: 단순 계산 vs 중간재고 차감

\`\`\`
[단순 계산]
제품 A 생산계획: 100개
├─ 부품 B (정미소요량: 2)
   필요량 = 100 × 2 = 200개

[중간재고 차감 적용]
제품 A 생산계획: 100개
├─ 반제품 B (재고: 30개)
   └─ 부품 C (정미소요량: 3)

계산 과정:
1. A의 필요량: 100개
2. B 재고 차감: 100 - 30 = 70개
3. C 실제 필요량: 70 × 3 = 210개 (300개가 아님!)
\`\`\`

## 알고리즘 구현

### 1. 중간 부품 재고 공유 메커니즘

같은 날짜에 여러 경로가 동일한 중간 부품을 사용하는 경우, 재고를 공유해야 합니다.

\`\`\`javascript
// 공유 재고 맵 사용
const sharedIntermediateStocks = new Map();

function calculateEffectiveRequirement(path, dailyPlan) {
  let effectiveRequirement = dailyPlan;

  // BOM 경로를 따라 상위 부품의 재고 차감
  for (const intermediate of path.intermediates) {
    const availableStock = sharedIntermediateStocks.get(intermediate.partNo) || intermediate.stock;

    if (availableStock > 0) {
      const deduction = Math.min(effectiveRequirement, availableStock);
      effectiveRequirement -= deduction;

      // 공유 재고 업데이트
      sharedIntermediateStocks.set(
        intermediate.partNo,
        availableStock - deduction
      );
    }
  }

  return effectiveRequirement * path.bomMultiplier;
}
\`\`\`

### 2. 다중 사용처 집계

한 부품이 여러 완제품에 사용되는 경우:

\`\`\`javascript
// 일별 소요량 집계
const dailyRequirements = new Map();

for (const usage of part.usageInfo) {
  const productPlan = getProductionPlan(usage.productCode);

  for (const [date, quantity] of productPlan) {
    const effective = calculateEffectiveRequirement(usage.bomPath, quantity);

    const current = dailyRequirements.get(date) || 0;
    dailyRequirements.set(date, current + effective);
  }
}
\`\`\`

### 3. 가용재고 누적 계산

\`\`\`javascript
function calculateAvailableStock(part, dailyRequirements) {
  let remainingStock = part.currentStock;
  const dailyAvailable = [];

  for (const [date, required] of dailyRequirements) {
    const available = remainingStock - required;

    dailyAvailable.push({
      date,
      required,
      available,
      isShortage: available < 0
    });

    // 다음 날로 이월
    remainingStock = available;
  }

  return dailyAvailable;
}
\`\`\`

## 시행착오

### 1. 순환 참조 BOM

일부 레거시 데이터에 순환 참조가 있어서 무한 루프가 발생했습니다.

**해결**: 방문 체크 Set을 사용한 순환 감지

\`\`\`javascript
const visited = new Set();

function traverseBOM(partNo, visited) {
  if (visited.has(partNo)) {
    console.warn(\`순환 참조 감지: \${partNo}\`);
    return null;
  }
  visited.add(partNo);
  // ... 처리 로직
}
\`\`\`

### 2. 성능 이슈

수천 개의 부품을 매번 계산하니 응답 시간이 10초 이상 걸렸습니다.

**해결**: 캐싱 + 메모이제이션

\`\`\`javascript
// React useMemo 활용
const calculatedData = useMemo(() => {
  return calculateAllRequirements(parts, plans);
}, [parts, plans, filterCriteria]);
\`\`\`

### 3. 부족 판단 기준

단순히 "음수 = 부족"이 아니라 경고 수준을 세분화해야 했습니다.

\`\`\`javascript
const getWarningLevel = (available, required) => {
  if (available < 0) return 'danger';      // 위험: 부족
  if (available < required * 0.2) return 'warning';  // 경고
  if (available < required * 0.5) return 'caution';  // 주의
  return 'normal';
};
\`\`\`

## 결과

- 정확한 자재 소요량 예측으로 긴급 발주 80% 감소
- 중간재고 고려로 과잉 구매 방지
- Early Warning 대시보드로 부족 자재 사전 파악
    `
  },
  {
    id: 'jwt-rbac-implementation',
    title: 'JWT 인증 중앙화와 역할 기반 접근 제어 구현',
    date: '2025. 11. 15',
    tags: ['JWT', 'Security', 'Express', 'React'],
    excerpt: 'AuthContext를 통한 JWT 토큰 중앙화 관리와 역할 기반 API 접근 제어를 구현한 경험을 공유합니다.',
    content: `
## 요구사항

MRP 시스템에서 세 가지 역할이 필요했습니다:

- **admin**: 전체 시스템 관리, 사용자 관리
- **manager**: 생산계획 수립 및 수정
- **user**: 조회만 가능

## 기존 문제점

처음에는 각 컴포넌트에서 직접 localStorage의 토큰을 읽었습니다:

\`\`\`javascript
// 안티패턴: 각 컴포넌트에서 직접 토큰 관리
const token = localStorage.getItem('authToken');
fetch('/api/data', {
  headers: { 'Authorization': \`Bearer \${token}\` }
});
\`\`\`

**문제점**:
1. 토큰 갱신 시 모든 컴포넌트 수정 필요
2. 401 에러 처리 중복
3. 로그아웃 로직 분산

## 해결: AuthContext + API 클라이언트

### 1. AuthContext 생성

\`\`\`javascript
// contexts/AuthContext.js
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    const data = await response.json();

    localStorage.setItem('authToken', data.token);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
\`\`\`

### 2. API 클라이언트 중앙화

\`\`\`javascript
// utils/apiClient.js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// 요청 인터셉터: 자동 토큰 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// 응답 인터셉터: 401 자동 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
\`\`\`

### 3. 서버 미들웨어

\`\`\`javascript
// middleware/authMiddleware.js
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '토큰이 필요합니다' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: '유효하지 않은 토큰입니다' });
    }
    req.user = user;
    next();
  });
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }
    next();
  };
};
\`\`\`

### 4. API 라우트 보호

\`\`\`javascript
// 조회: 모든 인증된 사용자
app.get('/api/plans', authenticateToken, getPlanHandler);

// 수정: admin, manager만
app.post('/api/plans',
  authenticateToken,
  requireRole(['admin', 'manager']),
  savePlanHandler
);

// 삭제: admin만
app.delete('/api/plans/:id',
  authenticateToken,
  requireRole(['admin']),
  deletePlanHandler
);
\`\`\`

## 시행착오

### 1. 토큰 갱신 타이밍

토큰이 만료되기 직전에 갱신하지 않으면 사용자가 작업 중 로그아웃됩니다.

**해결**: 토큰 만료 1시간 전 알림

\`\`\`javascript
// 토큰 디코딩하여 만료 시간 확인
const checkTokenExpiry = () => {
  const token = localStorage.getItem('authToken');
  const decoded = jwt.decode(token);
  const expiresIn = decoded.exp * 1000 - Date.now();

  if (expiresIn < 3600000) { // 1시간 미만
    showRenewalNotification();
  }
};
\`\`\`

### 2. 프론트엔드 권한 체크

프론트엔드에서만 권한을 체크하면 API를 직접 호출하여 우회할 수 있습니다.

**원칙**: 프론트엔드는 UX용, 실제 검증은 서버에서

\`\`\`javascript
// 프론트엔드: UI 숨김용 (보안 아님)
{user.role === 'admin' && <DeleteButton />}

// 서버: 실제 권한 검증 (보안)
app.delete('/api/plans/:id', requireRole(['admin']), ...);
\`\`\`

## 결과

- 인증 로직 중앙화로 유지보수 용이
- 401 에러 일관된 처리
- 역할별 API 접근 제어 구현
    `
  },
  {
    id: 'qr-inventory-system',
    title: 'QR코드 기반 실시간 재고 추적 시스템 구축',
    date: '2025. 11. 08',
    tags: ['QR Code', 'React', 'Express', 'MySQL'],
    excerpt: 'html5-qrcode 라이브러리를 활용하여 실시간 QR 스캔 기반 재고 위치 추적 시스템을 구축한 경험을 공유합니다.',
    content: `
## 배경

BIN 데이터 관리 시스템에서 제품의 위치 이동을 추적해야 했습니다. 기존에는 수기로 입력하다 보니 오류가 많았고, 실시간 추적이 불가능했습니다.

## 워크플로우 설계

제품의 생명주기를 5단계로 정의했습니다:

\`\`\`
입고 → 세팅룸 → 슈퍼마켓 → 포장실 → 출고완료
\`\`\`

각 단계 이동 시 QR을 스캔하면 자동으로 위치가 업데이트되고, 이력이 기록됩니다.

## QR 스캔 구현

\`\`\`javascript
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    });

    scanner.render(
      (decodedText) => {
        // 연속 스캔 방지: 3회 연속 동일 코드만 유효
        handleScan(decodedText);
      },
      (error) => {
        // 스캔 실패는 무시 (카메라가 계속 시도)
      }
    );

    return () => scanner.clear();
  }, []);

  return <div id="reader" />;
};
\`\`\`

## 데이터베이스 설계

### 핵심 테이블

\`\`\`sql
-- BIN 데이터
CREATE TABLE bin_data (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bin_sn VARCHAR(50),
  product_sn VARCHAR(50),
  location_id INT,
  assigned_to VARCHAR(50),
  count_in_bin INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 이동 이력
CREATE TABLE bin_data_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bin_data_id INT,
  from_location_id INT,
  to_location_id INT,
  moved_at DATETIME,
  moved_by VARCHAR(50),
  action VARCHAR(20)
);

-- 위치 마스터
CREATE TABLE location (
  id INT PRIMARY KEY,
  location_name VARCHAR(100),
  description TEXT
);
\`\`\`

## 시행착오

### 1. 카메라 권한 문제

모바일 브라우저에서 카메라 권한 획득이 실패하는 경우가 많았습니다.

**해결**: HTTPS 필수 + 권한 요청 안내

\`\`\`javascript
const checkCameraPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    alert('카메라 권한이 필요합니다. 브라우저 설정을 확인해주세요.');
    return false;
  }
};
\`\`\`

### 2. 동시 스캔 충돌

여러 작업자가 같은 제품을 동시에 스캔하는 경우가 있었습니다.

**해결**: 낙관적 잠금

\`\`\`javascript
// 업데이트 시 버전 체크
const moveProduct = async (productSn, newLocation, expectedVersion) => {
  const result = await pool.query(
    \`UPDATE bin_data
     SET location_id = ?, version = version + 1
     WHERE product_sn = ? AND version = ?\`,
    [newLocation, productSn, expectedVersion]
  );

  if (result.affectedRows === 0) {
    throw new Error('다른 사용자가 이미 수정했습니다. 새로고침 후 다시 시도해주세요.');
  }
};
\`\`\`

### 3. 오프라인 대응

공장 내 WiFi가 불안정한 구역이 있었습니다.

**해결**: 로컬 버퍼링 + 재전송

\`\`\`javascript
const pendingScans = [];

const submitScan = async (scanData) => {
  try {
    await api.post('/api/bins/move', scanData);
  } catch (error) {
    // 오프라인: 로컬 저장
    pendingScans.push({ ...scanData, timestamp: Date.now() });
    localStorage.setItem('pendingScans', JSON.stringify(pendingScans));
  }
};

// 온라인 복구 시 재전송
window.addEventListener('online', async () => {
  const pending = JSON.parse(localStorage.getItem('pendingScans') || '[]');
  for (const scan of pending) {
    await api.post('/api/bins/move', scan);
  }
  localStorage.removeItem('pendingScans');
});
\`\`\`

## 성과

- 입력 오류 90% 감소
- 재고 실사 시간 70% 단축
- 실시간 위치 추적으로 분실 제품 즉시 파악
    `
  },
  {
    id: 'early-warning-dashboard',
    title: 'Early Warning 대시보드: 재고 부족 예측 시스템',
    date: '2025. 10. 28',
    tags: ['React', 'Dashboard', 'Data Visualization', 'MRP'],
    excerpt: '일별 생산계획 대비 현재고를 분석하여 부족 자재를 사전에 경고하는 Early Warning 대시보드를 구축한 경험입니다.',
    content: `
## 문제 상황

생산 현장에서 자재 부족으로 라인이 멈추는 일이 빈번했습니다. 문제는 부족을 인지했을 때는 이미 늦은 경우가 많았다는 것입니다.

## 해결 방향

"오늘 기준으로 향후 N일간의 부족 자재를 미리 예측"하는 대시보드가 필요했습니다.

## 데이터 흐름

\`\`\`
일별 생산계획 → BOM 전개 → 일별 소요량 계산 → 현재고 대비 → 부족 예측
\`\`\`

## 핵심 로직

### 1. 일별 소요량 계산

\`\`\`javascript
const calculateDailyRequirements = (productPlans, bomData) => {
  const dailyReq = new Map();

  for (const plan of productPlans) {
    const { productCode, date, quantity } = plan;
    const bom = bomData[productCode];

    for (const part of bom.parts) {
      const key = \`\${part.partNo}_\${date}\`;
      const required = quantity * part.quantity;

      dailyReq.set(key, (dailyReq.get(key) || 0) + required);
    }
  }

  return dailyReq;
};
\`\`\`

### 2. 가용재고 추적

\`\`\`javascript
const trackAvailableStock = (partNo, currentStock, dailyRequirements) => {
  let remaining = currentStock;
  const forecast = [];

  // 오늘부터 30일간 예측
  for (let i = 0; i < 30; i++) {
    const date = addDays(today, i);
    const required = dailyRequirements.get(\`\${partNo}_\${formatDate(date)}\`) || 0;

    remaining -= required;

    forecast.push({
      date,
      required,
      available: remaining,
      status: remaining < 0 ? 'shortage' :
              remaining < required * 0.5 ? 'warning' : 'normal'
    });
  }

  return forecast;
};
\`\`\`

### 3. 경고 수준 정의

\`\`\`javascript
const WARNING_LEVELS = {
  danger: {
    condition: (available) => available < 0,
    color: '#ef4444',
    label: '부족'
  },
  warning: {
    condition: (available, required) => available < required * 0.3,
    color: '#f59e0b',
    label: '경고'
  },
  caution: {
    condition: (available, required) => available < required * 0.7,
    color: '#eab308',
    label: '주의'
  },
  normal: {
    condition: () => true,
    color: '#22c55e',
    label: '정상'
  }
};
\`\`\`

## 캐싱 전략

복잡한 BOM 계산은 비용이 크므로 캐싱이 필수였습니다.

\`\`\`sql
CREATE TABLE inventory_bi_cache (
  id INT PRIMARY KEY AUTO_INCREMENT,
  part_no VARCHAR(50),
  cache_date DATE,
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  INDEX idx_part_date (part_no, cache_date)
);
\`\`\`

\`\`\`javascript
const getCachedOrCalculate = async (partNo, date) => {
  // 캐시 확인
  const cached = await pool.query(
    'SELECT data FROM inventory_bi_cache WHERE part_no = ? AND cache_date = ? AND expires_at > NOW()',
    [partNo, date]
  );

  if (cached.length > 0) {
    return JSON.parse(cached[0].data);
  }

  // 계산 후 캐싱
  const calculated = await calculateForecast(partNo, date);

  await pool.query(
    'INSERT INTO inventory_bi_cache (part_no, cache_date, data, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))',
    [partNo, date, JSON.stringify(calculated)]
  );

  return calculated;
};
\`\`\`

## 시각화

Recharts를 사용하여 직관적인 대시보드를 구현했습니다:

\`\`\`javascript
<AreaChart data={forecastData}>
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Area
    dataKey="available"
    fill={(entry) => entry.available < 0 ? '#ef4444' : '#22c55e'}
  />
  <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
</AreaChart>
\`\`\`

## 결과

- 부족 자재 3일 전 사전 인지
- 긴급 발주 건수 60% 감소
- 생산 라인 정지 시간 대폭 단축
    `
  },
  {
    id: 'raspberry-pi-monitoring',
    title: 'Raspberry Pi로 온습도 모니터링 시스템 구축하기',
    date: '2025. 10. 15',
    tags: ['Raspberry Pi', 'Node-RED', 'IoT', 'React'],
    excerpt: 'Raspberry Pi와 DHT22 센서로 데이터를 수집하고, Node-RED를 통해 서버로 전송하여 실시간 대시보드를 구축한 경험입니다.',
    content: `
## 프로젝트 개요

제조 환경에서 온습도 관리는 품질에 직접적인 영향을 미칩니다. 기존에는 수동으로 측정하고 기록했지만, 실시간 모니터링과 알림 시스템이 필요했습니다.

## 데이터 흐름

\`\`\`
DHT22 센서 → Raspberry Pi → Node-RED → Express API → MySQL → React Dashboard
\`\`\`

## Node-RED 선택 이유

Node-RED를 선택한 이유는 비개발자도 흐름을 이해하고 수정할 수 있기 때문입니다. 드래그 앤 드롭으로 데이터 흐름을 구성할 수 있습니다.

### Node-RED 흐름

1. **Inject 노드**: 1분마다 트리거
2. **Function 노드**: DHT22에서 데이터 읽기
3. **Change 노드**: JSON 형태로 변환
4. **HTTP Request 노드**: Express API로 POST
5. **File 노드**: 전송 실패 시 로컬 저장

## 시행착오

### 1. 센서 오작동

DHT22가 간헐적으로 비정상적인 값(온도 -999 등)을 반환했습니다.

**해결**: 유효 범위 필터링 + 재시도

\`\`\`javascript
// Node-RED Function 노드
const readSensor = () => {
  for (let retry = 0; retry < 3; retry++) {
    const data = sensor.read();

    // 유효 범위 체크
    if (data.temperature >= -40 && data.temperature <= 80 &&
        data.humidity >= 0 && data.humidity <= 100) {
      return data;
    }

    // 1초 대기 후 재시도
    await sleep(1000);
  }

  return null; // 3회 실패
};
\`\`\`

### 2. 네트워크 불안정

공장 내 WiFi가 불안정하여 데이터 손실이 발생했습니다.

**해결**: 로컬 버퍼링 + 일괄 전송

\`\`\`javascript
// 전송 실패 시 로컬 파일에 저장
if (!response.ok) {
  const buffer = fs.readFileSync('buffer.json');
  const data = JSON.parse(buffer);
  data.push({ ...sensorData, timestamp: Date.now() });
  fs.writeFileSync('buffer.json', JSON.stringify(data));
}

// 연결 복구 시 일괄 전송
const flushBuffer = async () => {
  const buffer = JSON.parse(fs.readFileSync('buffer.json'));
  for (const item of buffer) {
    await api.post('/sensor-data', item);
  }
  fs.writeFileSync('buffer.json', '[]');
};
\`\`\`

### 3. 실시간 업데이트

React에서 1분마다 새로고침하는 것은 UX가 좋지 않았습니다.

**해결**: React Query의 refetchInterval 사용

\`\`\`javascript
const { data } = useQuery('sensorData', fetchSensorData, {
  refetchInterval: 60000, // 1분마다 백그라운드 갱신
  staleTime: 30000 // 30초간 캐시 유지
});
\`\`\`

## 알림 시스템

임계값 초과 시 알림을 보내도록 구현했습니다:

\`\`\`javascript
const checkThresholds = (data) => {
  const alerts = [];

  if (data.temperature < 15 || data.temperature > 35) {
    alerts.push({
      type: 'temperature',
      message: \`온도 이상: \${data.temperature}°C\`,
      level: 'critical'
    });
  }

  if (data.humidity < 30 || data.humidity > 70) {
    alerts.push({
      type: 'humidity',
      message: \`습도 이상: \${data.humidity}%\`,
      level: 'warning'
    });
  }

  return alerts;
};
\`\`\`

## 성과

- 24시간 무인 모니터링
- 이상 발생 시 즉시 알림
- 데이터 축적으로 계절별 패턴 분석 가능
    `
  },
  {
    id: 'yolo-packing-inspection',
    title: 'YOLO를 활용한 실시간 포장 검사 시스템',
    date: '2025. 10. 01',
    tags: ['YOLO', 'Python', 'OpenCV', 'Computer Vision'],
    excerpt: 'YOLOv8 객체 탐지 모델을 활용하여 제품 포장 상태를 실시간으로 검사하는 비전 시스템을 구축한 경험입니다.',
    content: `
## 배경

수작업으로 포장 상태를 검사하다 보니 불량 유출이 발생했습니다. 사람의 눈으로는 빠른 라인 속도를 따라가기 어려웠습니다.

## YOLO 선택 이유

실시간 검사가 필요했기 때문에 속도가 빠른 YOLO를 선택했습니다.

| 모델 | 정확도 | 속도 | 사용 편의성 |
|------|--------|------|-------------|
| YOLOv8 | 높음 | 매우 빠름 | 쉬움 |
| SSD | 중간 | 빠름 | 보통 |
| Faster R-CNN | 높음 | 느림 | 어려움 |

## 데이터 수집 및 학습

### 1. 데이터 수집

- 정상 포장 이미지: 500장
- 불량 포장 이미지: 500장 (찍힘, 이물질, 라벨 불량 등)

### 2. 라벨링

LabelImg를 사용하여 바운딩 박스 작업을 수행했습니다.

\`\`\`yaml
# data.yaml
train: ./data/train
val: ./data/val
nc: 3
names: ['normal', 'defect_dent', 'defect_label']
\`\`\`

### 3. 데이터 증강

\`\`\`python
from albumentations import (
    Compose, RandomBrightnessContrast,
    Rotate, HorizontalFlip
)

transform = Compose([
    RandomBrightnessContrast(p=0.5),
    Rotate(limit=15, p=0.3),
    HorizontalFlip(p=0.5)
])
\`\`\`

### 4. 모델 학습

\`\`\`python
from ultralytics import YOLO

model = YOLO('yolov8n.pt')  # nano 모델로 시작
model.train(
    data='data.yaml',
    epochs=50,
    imgsz=640,
    batch=16
)
\`\`\`

## 시행착오

### 1. 조명 문제

공장 조명에 따라 인식률이 크게 달라졌습니다.

**해결**:
- 별도 LED 조명 설치
- 히스토그램 평활화 전처리

\`\`\`python
import cv2

def preprocess(frame):
    # 히스토그램 평활화
    lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    l = clahe.apply(l)
    return cv2.cvtColor(cv2.merge([l,a,b]), cv2.COLOR_LAB2BGR)
\`\`\`

### 2. False Positive

정상 제품을 불량으로 판정하는 경우가 있었습니다.

**해결**: 연속 프레임 검증

\`\`\`python
consecutive_detections = 0
THRESHOLD = 3

def check_defect(results):
    global consecutive_detections

    if 'defect' in results.names:
        consecutive_detections += 1
    else:
        consecutive_detections = 0

    # 3프레임 연속 감지 시에만 알림
    if consecutive_detections >= THRESHOLD:
        trigger_alert()
        consecutive_detections = 0
\`\`\`

### 3. 미세 불량 검출

작은 찍힘이나 미세한 이물질은 검출하지 못했습니다.

**해결**: ROI(관심 영역) 확대 검사

\`\`\`python
def inspect_detail(frame, bbox):
    x1, y1, x2, y2 = bbox
    roi = frame[y1:y2, x1:x2]

    # ROI를 2배 확대
    enlarged = cv2.resize(roi, None, fx=2, fy=2)

    # 확대된 영역에서 재검사
    return model(enlarged, conf=0.5)
\`\`\`

## 최종 구현

\`\`\`python
from ultralytics import YOLO
import cv2

model = YOLO('packing_model.pt')
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # 전처리
    processed = preprocess(frame)

    # 추론
    results = model(processed, conf=0.7)

    # 결과 처리
    check_defect(results)

    # 시각화
    annotated = results[0].plot()
    cv2.imshow('Inspection', annotated)
\`\`\`

## 성과

- 불량 검출률: 95% 이상
- 검사 속도: 초당 30프레임 처리
- 불량 유출: 70% 감소
    `
  }
];
