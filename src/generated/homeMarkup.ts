// 메인(/) 마크업 — doc/mockups/home-v2.html 시안 반영("사람이 만든 페이지" v2).
// 기획: doc/14_homepage_v2_personality.md. 인터랙션은 src/components/HomeEnhancer.tsx.
// 공용 헤더/푸터는 layout.tsx(Header/Footer)가 제공하므로 여기엔 포함하지 않는다.
// 스타일은 globals.css의 `.home-v2` 스코프 블록 참조.
// nav/앵커 호환 ID: about · projects(서비스) · products(자료) · posts(저널) · newsletter · education.
export const homeMarkup = `
<div class="home-v2">
  <div id="hv-cursor">열기 →</div>

  <!-- ============ HERO ============ -->
  <section class="hero" id="top">
    <div class="glow" style="width:520px;height:520px;background:var(--moss);opacity:.18;top:-120px;left:-100px"></div>
    <div class="wrap hero-grid">
      <div>
        <div class="eyebrow rv"><span class="dot"></span> 개인 프로젝트 · 2024 –</div>
        <h1 class="display rv">
          <span class="small">AI 시대, 그래서 저는</span>
          읽고 만들고
          <span class="hand">연결하는<svg viewBox="0 0 300 12" preserveAspectRatio="none"><path d="M3 8 Q80 2 150 7 T297 5"/></svg></span>
          사람
        </h1>
        <p class="lede rv">제조 현장에서 ERP를 굴리다, 퇴근 후엔 도구를 만듭니다.
          <b>제가 쓰려고 만들었고</b>, 그대로 공개합니다.</p>
        <div class="btn-row rv">
          <a href="/#products" class="btn">무료 자료 받기</a>
          <a href="/#projects" class="btn-text">만든 것 둘러보기</a>
        </div>
        <div class="hero-meta rv">
          <div><b>2</b> 운영 중인 서비스</div>
          <div><b>37/100</b> 커피챗 신청</div>
          <div><b>100%</b> 무료 공개</div>
        </div>
      </div>
      <div class="rv">
        <a class="demo" href="https://linkmap.biz" target="_blank" rel="noopener" data-cursor>
          <div class="demo-bar"><span style="background:#f87171"></span><span style="background:#fbbf24"></span><span style="background:#34d399"></span>
            <span class="demo-url">🔒 linkmap.biz</span></div>
          <div class="demo-body">
            <span class="demo-tag">● 바이브 코딩 플랫폼</span>
            <h3>한 곳에서<br><em>서비스를 시각화하세요</em></h3>
            <p>구글 계정 하나로, 3분 뒤엔 배포돼 있어요.</p>
            <span class="pill">🚀 내 홈페이지 만들기</span>
            <div class="micro"><span>✓ 무료 플랜</span><span>✓ AES-256</span></div>
          </div>
        </a>
      </div>
    </div>
    <!-- 마퀴 -->
    <div class="marquee-band">
      <div class="marquee-track">
        <span>AI 바이브코딩</span><span>Next.js</span><span>Supabase</span><span>Stripe</span><span>Resend</span><span>Vercel</span><span>독서 · 필사</span><span>1인 SaaS</span>
        <span>AI 바이브코딩</span><span>Next.js</span><span>Supabase</span><span>Stripe</span><span>Resend</span><span>Vercel</span><span>독서 · 필사</span><span>1인 SaaS</span>
      </div>
    </div>
  </section>

  <!-- ============ ABOUT ============ -->
  <section class="about" id="about">
    <div class="wrap sec about-grid">
      <div class="rv">
        <div class="polaroid">
          <div class="photo"><div class="grain"></div><span>📷 본인 사진이 들어갈 자리</span></div>
          <div class="cap">— 퇴근 후, 또 뭔가 만드는 중</div>
        </div>
      </div>
      <div class="rv">
        <div class="kicker">소개</div>
        <blockquote>"AI가 답을 대신 써주는 시대일수록, 저는 더 많이
          <span class="hand">읽고 직접 만들어<svg viewBox="0 0 300 12" preserveAspectRatio="none"><path d="M3 7 Q90 3 160 7 T297 6"/></svg></span> 봅니다."</blockquote>
        <p class="intro">제조기업 ERP PM이자 AX(AI 전환) 담당자입니다. 가르치는 사람이 아니라,
          읽고 만들어 본 과정을 나누는 동료예요. 혼자보다 같이 더 멀리 갑니다.</p>
        <div class="chips">
          <span class="stamp">독서</span><span class="stamp">바이브코딩</span>
          <span class="stamp">제조 ERP PM</span><span class="stamp">AX · AI 전환</span><span class="stamp">LINKMAP</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ SERVICES ============ -->
  <section class="sec wrap" id="projects">
    <div class="sec-head rv">
      <div class="kicker">Services</div>
      <h2>지금 운영 중인 <em>실제 서비스</em></h2>
      <p>직접 만들어 지금 돌리고 있는 서비스입니다. 카드를 누르면 라이브로 바로 갑니다.</p>
    </div>
    <div class="bento">
      <a class="card big rv" href="https://linkmap.biz" target="_blank" rel="noopener" data-cursor>
        <div>
          <span class="live"><span class="dot"></span> 서비스 · 라이브</span>
          <h3>LINKMAP</h3>
          <span class="host">linkmap.biz ↗</span>
          <p class="desc">초보자부터 개발자까지, 구글 계정 하나로 <b>3분 만에 배포</b>하는 바이브 코딩 플랫폼.
            서비스 맵·환경변수(AES-256)를 한 곳에서.</p>
          <ul class="feat">
            <li>서비스 맵 시각화 &amp; 연결 체크리스트</li>
            <li>환경변수 안전 관리 (AES-256)</li>
            <li>30+ 서비스 · 프로젝트 템플릿</li>
          </ul>
        </div>
        <div class="demo-mini">
          <div class="play">▶</div>
          <small>10초 데모 영상이 자동재생되는 자리</small>
        </div>
      </a>
      <a class="card rv" href="https://readingtree.vercel.app" target="_blank" rel="noopener" data-cursor>
        <span class="live"><span class="dot"></span> 서비스 · 라이브</span>
        <h3>ReadTree</h3>
        <span class="host">readingtree.vercel.app ↗</span>
        <p class="desc">읽고 기록하면 <b>독서나무가 자라는</b> 습관 플랫폼. 읽은 모든 페이지가 자산이 됩니다.</p>
        <div class="tags"><span>#독서</span><span>#필사</span><span>#습관</span></div>
      </a>
      <a class="card dark rv" href="https://youtube.com" target="_blank" rel="noopener" data-cursor>
        <span class="live" style="color:var(--moss)"><span class="dot" style="background:var(--moss)"></span> 콘텐츠</span>
        <h3>YouTube 채널</h3>
        <p>AI·바이브코딩·독서 인사이트를 영상으로 정리하는 채널.</p>
        <div class="tags"><span style="color:var(--moss)">구독하기 ↗</span></div>
      </a>
    </div>
  </section>

  <!-- ============ RESOURCES ============ -->
  <section class="sec wrap" id="products">
    <div class="sec-head rv">
      <div class="kicker">Resources</div>
      <h2>무료로 공개하는 <em>교육 자료</em></h2>
      <p>전자책·강의·1:1 커피챗까지, 전부 교육 목적으로 공개해요. 공짜예요. 도움됐으면 커피 한 잔만.</p>
    </div>
    <div class="res-feature">
      <a class="card rv" href="/products" data-cursor>
        <div class="kicker" style="color:var(--clay)">전자책</div>
        <h3 style="font-size:1.5rem">바이브코딩으로 시작하는 1인 SaaS</h3>
        <p class="desc">기획부터 배포까지, 코드를 몰라도 서비스를 만드는 전자책.</p>
        <span class="stamp">교육용 100% 무료</span>
      </a>
      <a class="card rv" href="/education" data-cursor>
        <div class="kicker" style="color:var(--clay)">강의</div>
        <h3 style="font-size:1.5rem">LINKMAP 실전 강의</h3>
        <p class="desc">Supabase·Stripe·Resend를 LINKMAP으로 연결하는 영상 강의.</p>
        <span class="stamp">교육용 100% 무료</span>
      </a>
    </div>
    <a class="card rv" href="/coffee-chat" data-cursor>
      <div class="kicker" style="color:var(--clay)">1:1 커피챗 · 추첨 무료</div>
      <h3 style="font-size:1.5rem">신청 100명 모이면, 추첨으로 무료 세션</h3>
      <div class="gauge">
        <div class="gauge-bar"><div class="gauge-fill"></div></div>
        <small><b>37</b> / 100명 · 63명 더 모이면 추첨이 시작돼요</small>
      </div>
    </a>
    <div class="free-band rv">
      <div class="glow" style="width:300px;height:300px;background:var(--forest);opacity:.3;top:-80px;right:-40px"></div>
      <h3 style="position:relative">모든 자료는 교육 목적의 <span class="hand">무료 공개<svg viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M3 7 Q60 3 100 7 T197 6"/></svg></span>예요</h3>
      <a href="/support" class="btn" style="background:var(--moss);color:var(--ink);position:relative">응원하기 ♥</a>
    </div>
  </section>

  <!-- ============ JOURNAL ============ -->
  <section class="sec wrap" id="posts">
    <div class="sec-head rv" style="display:flex;justify-content:space-between;align-items:flex-end;max-width:none">
      <div><div class="kicker">Journal</div><h2>최근 글과 <em>영상</em></h2></div>
      <a href="/posts" class="btn-text">전체 보기 →</a>
    </div>
    <div class="journal-grid">
      <a class="feat-post rv" href="/posts">
        <span class="cat">바이브코딩</span>
        <h3>코드를 몰라도 서비스를 만드는 법</h3>
        <p>AI와 함께라면 비개발자도 실서비스를 출시할 수 있습니다. 제가 처음 헤맸던 그 첫 단계를 그대로 정리했습니다.</p>
        <span class="date">2026. 06. 01</span>
      </a>
      <div>
        <a class="mini-post rv" href="/posts">
          <span class="cat">LINKMAP</span>
          <h4>환경변수 때문에 배포가 막힐 때</h4>
          <p>가장 흔한 배포 실패 원인과 해결법.</p>
          <span class="date">2026. 05. 20</span>
        </a>
        <a class="mini-post rv" href="/posts">
          <span class="cat">독서</span>
          <h4>매일 10분 필사가 바꾼 것들</h4>
          <p>ReadTree로 3개월 필사하며 얻은 변화.</p>
          <span class="date">2026. 05. 08</span>
        </a>
      </div>
    </div>
  </section>

  <!-- ============ NEWSLETTER / 문의 ============ -->
  <section class="nl-band" id="newsletter">
    <div class="wrap sec">
      <div class="nl-card rv">
        <div class="kicker">Newsletter</div>
        <h2>새 글과 도구, <span class="hand" style="color:var(--forest)">먼저 받아보세요<svg viewBox="0 0 240 12" preserveAspectRatio="none"><path d="M3 7 Q70 3 120 7 T237 6" style="stroke:var(--forest)"/></svg></span></h2>
        <p>광고 없이, 새로 만든 것과 정리한 글만 가끔 보냅니다. 언제든 구독 해지할 수 있어요.</p>
        <form class="nl-form">
          <input id="nl-email" type="email" placeholder="이메일 주소" aria-label="이메일 주소" required />
          <button type="submit" class="btn">구독하기</button>
        </form>
        <p class="nl-msg" id="nl-msg" role="status" aria-live="polite"></p>
      </div>
    </div>
  </section>

  <!-- ============ EDUCATION ============ -->
  <section class="edu sec" id="education">
    <div class="glow" style="width:600px;height:400px;top:-100px;left:30%"></div>
    <div class="wrap">
      <div class="rv">
        <div class="kicker">✦ 바이브코딩 실습 과정</div>
        <h2>나만의 서비스를 <span class="hand">직접 만들어<svg viewBox="0 0 320 12" preserveAspectRatio="none"><path d="M3 8 Q90 2 170 7 T317 5"/></svg></span> 보세요</h2>
        <p class="sub">LINKMAP 템플릿으로 Supabase·Stripe·Resend까지 직접 연결합니다. 코드를 몰라도, 제가 했던 그대로 따라오시면 출시까지 함께합니다.</p>
        <div class="btn-row"><a href="/education" class="btn" style="background:var(--moss);color:var(--ink)">교육 과정 보기</a><a href="https://linkmap.biz" target="_blank" rel="noopener" class="btn-text">LINKMAP 살펴보기</a></div>
      </div>
      <div class="steps">
        <div class="step rv"><div class="n">01</div><h4>기획과 IA</h4><p>화면·데이터 구조를 설계.</p></div>
        <div class="step rv"><div class="n">02</div><h4>Next.js 화면</h4><p>랜딩·콘텐츠를 빠르게 구현.</p></div>
        <div class="step rv"><div class="n">03</div><h4>Supabase</h4><p>인증·DB·RLS 권한 연결.</p></div>
        <div class="step rv"><div class="n">04</div><h4>Stripe 결제</h4><p>Checkout·Webhook 완성.</p></div>
        <div class="step rv"><div class="n">05</div><h4>LINKMAP 배포</h4><p>환경변수 정리 후 Vercel.</p></div>
      </div>
    </div>
  </section>
</div>
`;
