<template>
  <router-view />
</template>
<style>
/* 全局布局 */
body, #app {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}

/* 动态背景 */
#app-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0a0a1a;
  background-image: 
    radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
    radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
    radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),
    radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px);
  background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px; 
  background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
  animation: a 40s linear infinite;
  z-index: -1; /* 置于最底层 */
}
@keyframes a {
  from { background-position: 0 0, 40px 60px, 130px 270px, 70px 100px; }
  to { background-position: 550px 550px, 390px 410px, 380px 520px, 220px 350px; }
}
</style>