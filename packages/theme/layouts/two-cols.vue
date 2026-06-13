<template>
  <SlideFrame mode="topic">
    <div class="two-cols">
      <div class="col"><slot /></div>
      <div class="col"><slot name="right" /></div>
    </div>
  </SlideFrame>
</template>
