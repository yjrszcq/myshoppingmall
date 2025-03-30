// src/stores/addressStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { updateAddressAPI, deleteAddressAPI, getAddressListAPI,addAddressAPI } from '@/apis/vip.js';

export const useAddressStore = defineStore('address', () => {
    // 地址列表状态
    const addressList = ref([]);

    // 获取地址列表
    const getAddressList = async () => {
        try {
            const response = await getAddressListAPI();
            addressList.value = response.address || [];
        } catch (error) {

            console.error('Failed to get address list:', error);

        }
    };

    // 添加地址
    const addAddress = async (addressData) => {
        try {
            await addAddressAPI(addressData);
            // 添加成功后重新获取地址列表
            await getAddressList();
        } catch (error) {

            console.error('Failed to add address: ', error);

        }
    };

    // 更新地址
    const updateAddress = async (addressId, addressData) => {
        try {
            await updateAddressAPI(addressId, addressData);
            // 更新成功后重新获取地址列表
            await getAddressList();
        } catch (error) {

            console.error('Failed to update address:', error);

        }
    };

    // 删除地址
    const deleteAddress = async (addressId) => {
        try {
            await deleteAddressAPI(addressId);
            // 删除成功后重新获取地址列表
            await getAddressList();
        } catch (error) {

            console.error('Failed to delete address:', error);


        }
    };

    return {
        addressList,
        getAddressList,
        updateAddress,
        deleteAddress,
        addAddress,
    };
});
