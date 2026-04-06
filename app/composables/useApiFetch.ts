export const useApiFetch = createUseFetch((options) => {
  const config = useRuntimeConfig()
  return { 
    ...options, 
    baseURL: options.baseURL ?? config.public.apiBase 
  }
})