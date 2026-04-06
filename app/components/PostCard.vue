<template>
  <div class="post-card">
    <div class="card-image">
      <img :src="`https://picsum.photos/seed/${post.id}/400/300`" :alt="post.title" loading="lazy">
    </div>

    <div class="card-content">
      <div class="content-top">
        <h2 class="card-headline">{{ truncatedTitle }}</h2>
        <p class="card-excerpt">{{ truncatedBody }}</p>
        <div class="card-date">{{ fabricatedDate }}</div>
      </div>
      
      <NuxtLink :to="`/post/${post.id}`" class="read-more-btn">Read More</NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Import silindi (Madde 9)

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const truncatedTitle = computed(() => {
  return props.post.title.length > 25 ? props.post.title.substring(0, 25) + '...' : props.post.title
})

const truncatedBody = computed(() => {
  return props.post.body.length > 80 ? props.post.body.substring(0, 80) + '...' : props.post.body
})

const fabricatedDate = computed(() => {
  const dates = ['Wed Jul 22 2020', 'Fri Aug 14 2020', 'Sat Sep 05 2020', 'Mon Oct 19 2020']
  return dates[props.post.id % dates.length]
})
</script>

<style scoped>
.post-card {
  background-color: white;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.post-card:hover {
  transform: scale(1.03);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.card-image img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  display: block;
}

.card-content {
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: space-between;
  text-align: center;
  align-items: center;
}

.content-top {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-headline {
  font-size: 26px;
  color: #1a1a1a;
  margin: 0 0 15px 0;
  font-weight: 500;
  text-transform: capitalize;
}

.card-excerpt {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 25px 0;
}

.card-date {
  font-size: 15px;
  color: #999;
  margin-bottom: 30px;
}

.read-more-btn {
  background-color: #bfa38f;
  color: white;
  text-decoration: none;
  padding: 15px 40px;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.2s ease;
  text-transform: capitalize;
  margin-top: auto;
}

.read-more-btn:hover {
  background-color: #a68b77;
}
</style>