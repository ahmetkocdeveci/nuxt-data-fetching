<template>
  <div class="blog-section">
    <div class="container">
      <h1 class="page-title">Our Blog</h1>
      
      <div v-if="pending" class="loading">Yükleniyor...</div>

      <div v-else class="carousel-wrapper">
        <button @click="scrollLeft" class="nav-btn left-btn">&#10094;</button>
        
        <div class="carousel-track" ref="carouselTrack" @wheel="handleWheel">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
            class="carousel-slide"
          />
        </div>

        <button @click="scrollRight" class="nav-btn right-btn">&#10095;</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { data: posts, pending } = await useFetch('https://jsonplaceholder.typicode.com/posts?_limit=10')

const carouselTrack = ref(null)

const scrollLeft = () => {
  if (carouselTrack.value) {
    carouselTrack.value.scrollBy({ left: -450, behavior: 'smooth' })
  }
}

const scrollRight = () => {
  if (carouselTrack.value) {
    carouselTrack.value.scrollBy({ left: 450, behavior: 'smooth' })
  }
}

const handleWheel = (e) => {
  if (carouselTrack.value) {
    e.preventDefault()
    carouselTrack.value.scrollLeft += e.deltaY * 4
  }
}
</script>

<style>
body {
  margin: 0;
}

.blog-section {
  background-color: #e6ded8;
  padding: 80px 0;
  min-height: 100vh;
  font-family: sans-serif;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-title {
  text-align: center;
  color: #1a1a1a;
  font-size: 40px;
  margin-bottom: 60px;
  padding-bottom: 20px;
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background-color: #1a1a1a;
}

.carousel-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.carousel-track {
  display: flex;
  align-items: stretch;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 30px;
  padding: 20px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-slide {
  flex: 0 0 420px;
  min-width: 420px;
  display: flex;
}

.nav-btn {
  background-color: transparent;
  border: none;
  font-size: 40px;
  color: #1a1a1a;
  cursor: pointer;
  padding: 10px;
  transition: transform 0.2s;
  z-index: 2;
}

.nav-btn:hover {
  transform: scale(1.2);
}

.loading {
  text-align: center;
  font-size: 24px;
  color: #1a1a1a;
}
</style>