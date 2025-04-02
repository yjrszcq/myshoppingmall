// src/stores/addressStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { updateAddressAPI, deleteAddressAPI, getAddressListAPI, addAddressAPI } from '@/apis/vip.js';

export const useAddressStore = defineStore('address', () => {
    const addressList = ref([]);

    const getAddressList = async () => {
        const response = await getAddressListAPI();
        addressList.value = response.address || [];
    };

    const addAddress = async (addressData) => {
        const response = await addAddressAPI(addressData);
        addressList.value.push(response.data); // 假设API返回新地址
        return response;
    };

    const updateAddress = async (addressId, addressData) => {
        await updateAddressAPI(addressId, addressData);
        const index = addressList.value.findIndex(item => item.addressId === addressId);
        if (index !== -1) {
            addressList.value[index] = { ...addressList.value[index], ...addressData };
        }
    };

    const deleteAddress = async (addressId) => {
        await deleteAddressAPI(addressId);
        addressList.value = addressList.value.filter(item => item.addressId !== addressId);
    };

    return {
        addressList,
        getAddressList,
        updateAddress,
        deleteAddress,
        addAddress,
    };
});