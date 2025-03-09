export const addToCart = async (productId, quantity, token) => {
    await axios.post(
        '${API_URL}cart/',
        {product: productId, quantity},
        {headers: {Authorization: 'Bearer ${token}'}}
    );
};