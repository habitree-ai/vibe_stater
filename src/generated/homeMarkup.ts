// 메인(/) 마크업 — doc/mockups/home-v2.html 시안 반영("사람이 만든 페이지" v2).
// 기획: doc/14_homepage_v2_personality.md. 인터랙션은 src/components/HomeEnhancer.tsx.
// 공용 헤더/푸터는 layout.tsx(Header/Footer)가 제공하므로 여기엔 포함하지 않는다.
// 스타일은 globals.css의 `.home-v2` 스코프 블록 참조.
// nav/앵커 호환 ID: about · education(무작정 따라하기) · projects(서비스) · products(자료) · posts(저널) · newsletter.
// 구성 순서: 히어로 → 소개 → 무작정 따라하기(핵심 교육) → 서비스 → 무료 자료 → 저널 → 뉴스레터.
// (유튜브/강의/교육은 '무작정 따라하기' 한 블록으로 통합 — 중복 제거)
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
          <a href="/#education" class="btn">무작정 따라하기 시작</a>
          <a href="/#projects" class="btn-text">만든 도구 보기</a>
        </div>
        <div class="hero-meta rv">
          <div><b>2</b> 직접 운영하는 서비스</div>
          <div><b>3편</b> 무작정 따라하기 공개</div>
          <div><b>100%</b> 무료 공개</div>
        </div>
      </div>
      <div class="rv">
        <a class="demo" href="https://linkmap.biz" rel="noopener noreferrer" data-cursor>
          <div class="demo-bar"><span style="background:#f87171"></span><span style="background:#fbbf24"></span><span style="background:#34d399"></span>
            <span class="demo-url">🔒 linkmap.biz</span></div>
          <img class="demo-shot" src="/img/linkmap-main.png" alt="LINKMAP 메인 화면 — 한 플랫폼에서 3분 만에 배포" width="1798" height="872" />
        </a>
      </div>
    </div>
    <!-- 마퀴 -->
    <div class="marquee-band">
      <div class="marquee-track">
        <span>AI 바이브코딩</span><span>Next.js</span><span>Supabase</span><span>Polar</span><span>Resend</span><span>Vercel</span><span>독서 · 필사</span><span>1인 SaaS</span>
        <span>AI 바이브코딩</span><span>Next.js</span><span>Supabase</span><span>Polar</span><span>Resend</span><span>Vercel</span><span>독서 · 필사</span><span>1인 SaaS</span>
      </div>
    </div>
  </section>

  <!-- ============ ABOUT ============ -->
  <section class="about" id="about">
    <div class="wrap sec about-grid">
      <div class="rv">
        <figure class="idcard">
          <div class="idcard-grain"></div>
          <div class="idcard-top">
            <span class="idcard-kicker">지금 하는 일</span>
            <span class="idcard-live"><span class="dot"></span> 만드는 중</span>
          </div>
          <p class="idcard-motto">읽고 · 만들고 ·
            <span class="hand">나눕니다<svg viewBox="0 0 300 12" preserveAspectRatio="none"><path d="M3 8 Q90 3 160 7 T297 6"/></svg></span>
          </p>
          <ul class="idcard-facts">
            <li><b>제조 ERP</b> 현장에서 시스템을 굴립니다</li>
            <li><b>AX · AI 전환</b>을 실무에 붙입니다</li>
            <li>퇴근 후엔 <b>1인 SaaS</b>를 만듭니다</li>
          </ul>
          <svg class="idcard-sign" viewBox="0 0 200 34" preserveAspectRatio="none" aria-hidden="true">
            <path d="M6 24 C 24 4, 40 6, 46 22 S 72 32, 94 12 T 148 18 Q 176 22, 194 8"/>
          </svg>
          <figcaption class="idcard-cap">— 퇴근 후, 또 뭔가 만드는 중</figcaption>
        </figure>
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

  <!-- ============ 무작정 따라하기 (핵심 교육) ============ -->
  <section class="edu sec" id="education">
    <div class="glow" style="width:600px;height:400px;top:-100px;left:30%"></div>
    <div class="wrap">
      <div class="edu-head rv">
        <div class="kicker">✦ 바이브코딩 무작정 따라하기</div>
        <h2>코딩 몰라도, <span class="hand">오늘 내 사이트를<svg viewBox="0 0 320 12" preserveAspectRatio="none"><path d="M3 8 Q90 2 170 7 T317 5"/></svg></span> 인터넷에</h2>
        <p class="sub">왜 시작해야 하는지부터 3분 만에 배포까지. 어려운 용어 없이, 유튜브 영상을 그대로 따라오면 됩니다.
          지금 <b>3편 공개</b> · 다음 편 순차 추가.</p>
      </div>

      <div class="ep-list">
        <a class="ep-card rv" href="https://www.youtube.com/watch?v=TKe41WMIhrQ&list=PLhCPUlBwmKCV6sc_li9MVLZeLrAq_iaFL" target="_blank" rel="noopener noreferrer" data-cursor>
          <figure class="ep-thumb">
            <img src="https://i.ytimg.com/vi/TKe41WMIhrQ/hqdefault.jpg" alt="영상 — AI 시대, 끝까지 살아남는 단 하나의 무기" loading="lazy" width="480" height="360" />
            <span class="ep-play" aria-hidden="true">▶</span>
          </figure>
          <div class="ep-body">
            <div class="ep-tag"><span class="ep-no">EP1</span><span class="ep-role">동기</span></div>
            <h4>AI 시대, 끝까지 살아남는 단 하나의 무기</h4>
            <p>왜 지금 바이브코딩을 시작해야 하는지, 그 이유부터.</p>
          </div>
        </a>
        <a class="ep-card rv" href="https://www.youtube.com/watch?v=zJDF2e4dYKU&list=PLhCPUlBwmKCV6sc_li9MVLZeLrAq_iaFL" target="_blank" rel="noopener noreferrer" data-cursor>
          <figure class="ep-thumb">
            <img src="https://i.ytimg.com/vi/zJDF2e4dYKU/hqdefault.jpg" alt="영상 — 바이브코딩 무작정 따라하기, 비개발자도 진짜 될까?" loading="lazy" width="480" height="360" />
            <span class="ep-play" aria-hidden="true">▶</span>
          </figure>
          <div class="ep-body">
            <div class="ep-tag"><span class="ep-no">EP2</span><span class="ep-role">개요</span></div>
            <h4>바이브코딩 무작정 따라하기, 비개발자도 진짜 될까?</h4>
            <p>코드 한 줄 몰라도 되는지, 전체 그림을 먼저 봅니다.</p>
          </div>
        </a>
        <a class="ep-card rv" href="https://www.youtube.com/watch?v=he2_I9LCmQU&list=PLhCPUlBwmKCV6sc_li9MVLZeLrAq_iaFL" target="_blank" rel="noopener noreferrer" data-cursor>
          <figure class="ep-thumb">
            <img src="https://i.ytimg.com/vi/he2_I9LCmQU/hqdefault.jpg" alt="영상 — 3분 만에 오늘 내 사이트를 인터넷에 올리기" loading="lazy" width="480" height="360" />
            <span class="ep-play" aria-hidden="true">▶</span>
            <span class="ep-new">NEW</span>
          </figure>
          <div class="ep-body">
            <div class="ep-tag"><span class="ep-no">EP3</span><span class="ep-role">실습</span></div>
            <h4>3분 만에 오늘 내 사이트를 인터넷에 올리기</h4>
            <p>구글 계정·AI·원클릭 배포로, 진짜 내 사이트를 공개해요.</p>
          </div>
        </a>
      </div>

      <div class="ep-roadmap rv">
        <span class="ep-roadmap-label">다음 편 예정</span>
        <span class="ep-chip">내 맘대로 고치기</span>
        <span class="ep-chip">데이터 연결</span>
        <span class="ep-chip">결제 받기</span>
      </div>

      <div class="btn-row rv">
        <a href="https://www.youtube.com/playlist?list=PLhCPUlBwmKCV6sc_li9MVLZeLrAq_iaFL" target="_blank" rel="noopener noreferrer" class="btn" style="background:var(--moss);color:var(--ink)">재생목록 전체 보기</a>
        <a href="/education" class="btn-text">교육 안내</a>
        <a href="https://linkmap.biz" rel="noopener noreferrer" class="btn-text">LINKMAP으로 시작 →</a>
      </div>
    </div>
  </section>

  <!-- ============ SERVICES ============ -->
  <section class="sec wrap" id="projects">
    <div class="sec-head rv">
      <div class="kicker">Services</div>
      <h2>내가 만들어 <em>매일 쓰는 도구</em></h2>
      <p>남이 만든 걸 소개하지 않아요. 직접 만들어 지금도 돌리는 서비스입니다.
        무작정 따라하기 EP3에서 쓰는 그 도구예요.</p>
    </div>
    <div class="bento">
      <a class="card rv" href="https://linkmap.biz" rel="noopener noreferrer" data-cursor>
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
        <figure class="shot">
          <div class="shot-bar"><i style="background:#f87171"></i><i style="background:#fbbf24"></i><i style="background:#34d399"></i><span class="u">🔒 linkmap.biz</span></div>
          <img src="/img/linkmap-main.png" alt="LINKMAP 메인 화면 — 한 플랫폼에서 3분 만에 배포" loading="lazy" width="1798" height="872" />
        </figure>
      </a>
      <a class="card rv" href="https://read.habitree.io" rel="noopener noreferrer" data-cursor>
        <span class="live"><span class="dot"></span> 서비스 · 라이브</span>
        <h3>ReadTree</h3>
        <span class="host">read.habitree.io ↗</span>
        <p class="desc">읽고 기록하면 <b>독서나무가 자라는</b> 습관 플랫폼. 읽은 모든 페이지가 자산이 됩니다.</p>
        <ul class="feat">
          <li>독서 기록 &amp; 통계 · 독서나무 성장</li>
          <li>AI 채팅 · OCR 필사 · AI 리포트</li>
          <li>독서 그룹 · 독서 달력</li>
        </ul>
        <figure class="shot">
          <div class="shot-bar"><i style="background:#f87171"></i><i style="background:#fbbf24"></i><i style="background:#34d399"></i><span class="u">🔒 read.habitree.io</span></div>
          <img src="/img/readtree-main.png" alt="ReadTree 대시보드 — 독서 기록으로 자라는 독서나무" loading="lazy" width="1723" height="886" />
        </figure>
      </a>
    </div>
  </section>

  <!-- ============ RESOURCES ============ -->
  <section class="sec wrap" id="products">
    <div class="sec-head rv">
      <div class="kicker">Resources</div>
      <h2>곁들이는 <em>무료 자료</em></h2>
      <p>영상 강의(무작정 따라하기) 말고도, 바로 읽는 입문 전자책과 1:1 커피챗을 무료로 열어둬요.</p>
    </div>
    <div class="res-feature">
      <a class="card rv" href="/ebook/vibe-1in-saas.html" target="_blank" rel="noopener noreferrer" data-cursor>
        <div class="kicker" style="color:var(--clay)">전자책 · 무료 공개</div>
        <h3 style="font-size:1.5rem">바이브코딩으로 시작하는 1인 SaaS</h3>
        <p class="desc">코드를 몰라도 괜찮아요. 아이디어 한 문장에서 배포까지, 15분이면 읽는 입문서.</p>
        <figure class="res-thumb">
          <img src="/img/covers/ebook-vibe.png" alt="전자책 표지 — 바이브코딩으로 시작하는 1인 SaaS" loading="lazy" width="1400" height="1120" />
        </figure>
        <span class="stamp">바로 읽기 ↗</span>
      </a>
      <a class="card rv" href="/coffee-chat" data-cursor>
        <div class="kicker" style="color:var(--clay)">1:1 커피챗 · 추첨 무료</div>
        <h3 style="font-size:1.5rem">신청 100명 모이면, 추첨으로 무료 세션</h3>
        <p class="desc">온라인·오프라인, 원하는 방식으로. 부담 없이 신청만 남겨 주세요.</p>
        <div class="gauge">
          <div class="gauge-bar"><div class="gauge-fill"></div></div>
          <small><b>37</b> / 100명 · 63명 더 모이면 추첨이 시작돼요</small>
        </div>
      </a>
    </div>
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
</div>
`;
