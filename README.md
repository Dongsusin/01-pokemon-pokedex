# 🐣 포켓몬 도감

[![Netlify Status](https://api.netlify.com/api/v1/badges/9f2d8c7a-fc2b-4b52-8d39-12dd22185f0e/deploy-status)](https://brilliant-alfajores-bbb341.netlify.app/)

**🔗 배포 링크**: [https://brilliant-alfajores-bbb341.netlify.app/](https://brilliant-alfajores-bbb341.netlify.app/)

포켓몬 API를 활용하여 만든 반응형 포켓몬 도감 앱입니다. 포켓몬의 이름, 이미지, 세부 정보 등을 무한 스크롤 및 상세 페이지로 확인할 수 있습니다.

<img src="./pokedex.png" alt="포켓몬 도감 앱 스크린샷" width="700"/>

---

## 🚀 주요 기능

- 🔍 **포켓몬 검색 및 무한 스크롤**
- 📄 **포켓몬 상세 정보 페이지** (이미지, 키, 몸무게, 타입, 특성 등)
- 🔁 **React Router 기반 페이지 라우팅**
- ⚡ **로딩 최적화를 위한 Axios와 비동기 처리**

---

## 🛠️ 사용 기술

- ⚛️ **React** - 컴포넌트 기반 UI 구성
- 🧭 **React Router DOM** - 페이지 이동 처리
- 📡 **Axios** - API 데이터 요청
- 🔁 **Infinite Scroll** - 포켓몬 목록 무한 로딩

---

## 📁 프로젝트 구조

```
├── public/
├── src/
│   ├── components/        # 재사용 가능한 UI 컴포넌트
│   ├── pages/             # 라우팅되는 주요 페이지들
│   ├── api/               # 포켓몬 API 호출 함수
│   ├── styles/            # CSS 스타일
│   └── App.js             # 전체 라우팅 구성
├── package.json
├── README.md
└── pokedex.png            # 프로젝트 썸네일 이미지
```

---
