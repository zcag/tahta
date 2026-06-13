<template>
  <SlideFrame mode="topic">
    <Fit>
      <div class="two-cols">
        <div class="col"><slot /></div>
        <div class="col"><slot name="right" /></div>
      </div>
    </Fit>
  </SlideFrame>
</template>
