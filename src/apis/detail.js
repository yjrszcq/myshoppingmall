import httpInstance from '@/utils/http'; // 你的 axios 实例路径

// 获取产品详情
export const getProductById = (productId) => {
    return httpInstance.get(`/api/products/${productId}`);
};
