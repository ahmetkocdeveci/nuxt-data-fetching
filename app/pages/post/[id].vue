<template>
  <div class="post-detail-page">
    <div class="container">
      <NuxtLink to="/" class="back-link">&#10094; Back</NuxtLink>

      <div v-if="status === 'pending'" class="loading">Yükleniyor...</div>
      <div v-else-if="status === 'error' || error" class="loading" style="color: #d9534f;">Bir hata oluştu: {{ error?.message }}</div>

      <div v-else-if="status === 'success' && post" class="post-wrapper">
        <h1 class="section-heading">In this blog</h1>
        
        <div class="content-split">
          <div class="image-side">
            <img :src="`https://picsum.photos/seed/${post.id}/800/600`" :alt="post.title">
          </div>
          <div class="text-side">
            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-body">{{ post.body }}</p>
          </div>
        </div>

        <div class="comments-section">
          <h3 class="comments-heading">Comments</h3>
          
          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-avatar">
                {{ comment.name.charAt(0).toUpperCase() }}
              </div>
              <div class="comment-content">
                <h4 class="comment-author">{{ comment.name }}</h4>
                <p class="comment-email">{{ comment.email }}</p>
                <p class="comment-text">{{ comment.body }}</p>
              </div>
            </div>
          </div>

          <div class="comment-form-wrapper">
            <h4 class="form-heading">Leave a Comment</h4>
            <form @submit.prevent="submitComment" class="comment-form">
              <div class="form-row">
                <input v-model="newComment.name" type="text" placeholder="Your Name" required>
                <input v-model="newComment.email" type="email" placeholder="Your Email" required>
              </div>
              <textarea v-model="newComment.body" placeholder="Write your comment here..." rows="4" required></textarea>
              <button type="submit" class="submit-btn">Post Comment</button>
            </form>
          </div>
        </div>

        <div class="recommendations-section">
          <h3 class="recommendations-heading">Read More</h3>
          <div class="recommendations-grid">
            <PostCard
              v-for="rec in recommendedPosts"
              :key="rec.id"
              :post="rec"
            />
          </div>
        </div>
      </div>

      <div v-else>
        <p>Yazı bulunamadı.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()

const id = computed(() => route.params.id)

const { data, status, error } = await useAsyncData(
  computed(() => `post-detail-${id.value}`),
  async (_nuxtApp, { signal }) => {
    const [postData, allPostsData, commentsData] = await Promise.all([
      $fetch(`/posts/${id.value}`, { baseURL: config.public.apiBase, signal }),
      $fetch('/posts', { baseURL: config.public.apiBase, query: { _limit: 15 }, signal })
        .then(posts => posts.map(p => ({ id: p.id, title: p.title, body: p.body }))), // SSR payloadı için .map transformu
      $fetch(`/posts/${id.value}/comments`, { baseURL: config.public.apiBase, signal })
    ])
    return { postData, allPostsData, commentsData }
  }
)

const post = computed(() => data.value?.postData)
const allPosts = computed(() => data.value?.allPostsData)
const fetchedComments = computed(() => data.value?.commentsData)

const comments = ref([])

watch(fetchedComments, (newVal) => {
  if (newVal) {
    comments.value = [...newVal]
  }
}, { immediate: true })

const newComment = ref({ name: '', email: '', body: '' })

const submitComment = () => {
  if (!newComment.value.name || !newComment.value.email || !newComment.value.body) return

  comments.value.push({
    id: Date.now(),
    postId: Number(id.value),
    name: newComment.value.name,
    email: newComment.value.email,
    body: newComment.value.body
  })
  newComment.value = { name: '', email: '', body: '' }
}

const recommendedPosts = computed(() => {
  if (!allPosts.value) return []
  const currentId = Number(id.value)
  return allPosts.value
    .filter(p => p.id !== currentId)
    .slice(0, 3)
})
</script>

<style scoped>
.post-detail-page { background-color: #e6ded8; min-height: 100vh; padding: 60px 0; font-family: sans-serif; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.back-link { display: inline-block; margin-bottom: 40px; color: #1a1a1a; text-decoration: none; font-weight: 600; font-size: 16px; transition: transform 0.2s; }
.back-link:hover { transform: translateX(-5px); }
.section-heading { text-align: center; font-size: 36px; color: #1a1a1a; margin-bottom: 50px; position: relative; padding-bottom: 15px; }
.section-heading::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 50px; height: 2px; background-color: #1a1a1a; }
.content-split { display: flex; gap: 50px; background: white; padding: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 60px; align-items: center; }
.image-side { flex: 1; }
.image-side img { width: 100%; height: auto; display: block; object-fit: cover; }
.text-side { flex: 1; }
.post-title { font-size: 32px; color: #1a1a1a; margin: 0 0 20px 0; text-transform: capitalize; }
.post-body { font-size: 18px; color: #444; line-height: 1.8; }
.comments-section { background: white; padding: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-bottom: 60px; }
.comments-heading { font-size: 28px; color: #1a1a1a; margin-bottom: 40px; padding-bottom: 15px; border-bottom: 1px solid #e6ded8; }
.comments-list { display: flex; flex-direction: column; gap: 30px; margin-bottom: 50px; }
.comment-item { display: flex; gap: 20px; }
.comment-avatar { width: 50px; height: 50px; background-color: #bfa38f; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; flex-shrink: 0; }
.comment-content { flex: 1; }
.comment-author { margin: 0 0 5px 0; font-size: 18px; color: #1a1a1a; text-transform: capitalize; }
.comment-email { margin: 0 0 15px 0; font-size: 14px; color: #888; }
.comment-text { margin: 0; font-size: 16px; color: #555; line-height: 1.6; }
.comment-form-wrapper { background-color: #fcfbf9; padding: 30px; border: 1px solid #e6ded8; }
.form-heading { font-size: 22px; color: #1a1a1a; margin-bottom: 25px; }
.comment-form { display: flex; flex-direction: column; gap: 20px; }
.form-row { display: flex; gap: 20px; }
.form-row input { flex: 1; }
.comment-form input, .comment-form textarea { padding: 15px; border: 1px solid #ccc; font-family: inherit; font-size: 16px; outline: none; transition: border-color 0.2s; }
.comment-form input:focus, .comment-form textarea:focus { border-color: #bfa38f; }
.submit-btn { background-color: #1a1a1a; color: white; border: none; padding: 15px 30px; font-size: 16px; font-weight: 600; cursor: pointer; align-self: flex-start; transition: background-color 0.2s; }
.submit-btn:hover { background-color: #bfa38f; }
.recommendations-section { margin-top: 60px; }
.recommendations-heading { font-size: 28px; color: #1a1a1a; margin-bottom: 40px; text-align: center; }
.recommendations-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.loading { text-align: center; font-size: 24px; color: #1a1a1a; }

@media (max-width: 992px) {
  .content-split { flex-direction: column; gap: 30px; padding: 20px; }
  .text-side { text-align: center; }
  .post-title { font-size: 28px; }
  .comments-section, .recommendations-grid { padding: 20px; }
  .recommendations-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
}

@media (max-width: 768px) {
  .post-detail-page { padding: 30px 0; }
  .section-heading { font-size: 28px; margin-bottom: 30px; }
  .recommendations-grid { grid-template-columns: 1fr; gap: 20px; }
  .form-row { flex-direction: column; gap: 20px; }
  .comment-item { gap: 15px; }
  .comment-avatar { width: 40px; height: 40px; font-size: 18px; }
}
</style>