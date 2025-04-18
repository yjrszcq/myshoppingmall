import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getMyCollect, removeCollect, addCollect } from '@/apis/vip.js'
import { ElMessage } from 'element-plus'

export const useCollectionStore = defineStore('collection', () => {
    // 收藏列表
    const collections = ref([])
    // 加载状态
    const loading = ref(false)

    // 获取收藏列表
    const fetchCollections = async (page = 1, limit = 5) => {
        loading.value = true
        try {
            const res = await getMyCollect(page, limit)
            collections.value = res?.favorites || []
            return collections.value
        } catch (error) {
            ElMessage.error('获取收藏列表失败')
            throw error
        } finally {
            loading.value = false
        }
    }

    // 添加收藏
    const addToCollection = async (productId) => {
        try {
            console.log(productId,"storeId")
            await addCollect(productId)
            ElMessage.success('收藏成功')
            await fetchCollections()
        } catch (error) {
            ElMessage.error('收藏失败')
            throw error
        }
    }

    // 移除收藏
    const removeFromCollection = async (productId) => {
        try {
            await removeCollect(productId)
            ElMessage.success('已取消收藏')
            console.log(productId,"cancel")
            // 从本地列表中移除
            collections.value = collections.value.filter(
                item => item.productId !== productId
            )
        } catch (error) {
            ElMessage.error('取消收藏失败')
            throw error
        }
    }

    // 检查是否已收藏
    const isCollected = (productId) => {
        console.log(collections,"collections")
        return collections.value.some(item => item.productId === productId)
    }

    // 切换收藏状态
    const toggleCollection = async (productId) => {
        if (isCollected(productId)) {
            console.log(productId,"remove")
            await removeFromCollection(productId)
        } else {
            console.log(productId,"add")
            await addToCollection(productId)
        }
    }

    return {
        collections,
        loading,
        fetchCollections,
        addToCollection,
        removeFromCollection,
        isCollected,
        toggleCollection
    }
})