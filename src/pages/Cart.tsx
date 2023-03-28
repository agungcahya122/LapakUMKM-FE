import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Navbar from '../components/Navbar'
import FotoProfile from '../assets/profile.jpg'
import { formatValue } from 'react-currency-input-field'
import CustomButton from '../components/CustomButton'
import CartCard from '../components/CartCard'
import { useCookies } from 'react-cookie'
import axios from 'axios'

interface Product {
    selected: unknown
    id: number
    lapak_address: string
    lapak_name: string
    product_id: number
    product_name: string
    product_pcs: number
    product_price: number
    user_id: number
    total_price: number
}
interface CartData {
    products?: Product
}

interface CartItem {
    id: number
    product_price: number
    lapak_name: string
    product_pcs: number
}

const Cart: React.FC<CartData> = ({ products }) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<any>([])
    const [cookies, setCookies, removeCookies] = useCookies(['token'])
    const [checked, setChecked] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Product[]>([]);
    const [newCart, setnewCart] = useState<Product[]>([]);
    const [price, setPrice] = useState<number>(0)
    const [count, setCount] = useState<number>()
    const [cart, nsetNewCart] = useState<Product[]>([])
    const [totalPrice, setTotalPrice] = useState<number>(price)

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, product: Product) => {
        const isChecked = e.target.checked;

        setSelectedItems((prevState) => {
            const updatedItems = isChecked
                ?
                [...prevState, product]
                : prevState.filter((selectedItem) => selectedItem.id !== product.id);
            product.total_price = 0
            setnewCart(updatedItems)
            TotalCart();
            return updatedItems;
        });
      
    };
    console.log('updatedItems');
    console.log("new", newCart)

    useEffect(() => {
        newCart
    }, [])

    console.log('test cart 2', cart);
    
    const handleIncrement = (i: CartItem) => {
        let _cart = newCart.map((item) => {
            if (item.id === i.id) {
                item.product_pcs++;
                
            }
            return item;
        });
        
        setnewCart(_cart);
    };

    const handleDecrement = (i: CartItem) => {
        let _cart = newCart.map((item) => {
            if (item.id === i.id) {
                if (item.product_pcs === 1) {
                    return item;
                } else {
                    item.product_pcs--;
                }
            }
            return item;
        });
        setnewCart(_cart);
    };
    console.log('teattt', cart);
    
    const test1 = [...cart]
    const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const allCheckboxesChecked = e.target.checked;
        setChecked(allCheckboxesChecked);
      
        const updatedCart = cart.map((item) => {
          const selected = allCheckboxesChecked;
          return { ...item, selected };
        });
      
        setnewCart(updatedCart);
      
        const selectedItems = updatedCart.filter((item) => item.selected);
      
        let totalPrice = 0;
        let totalCount = 0;
      
        if (selectedItems.length > 0) {
          totalPrice = selectedItems.reduce((total, item) => {
            return total + item.product_price * item.product_pcs;
          }, 0);
      
          totalCount = selectedItems.reduce((total, item) => {
            return total + item.product_pcs;
          }, 0);
        }
      
        setPrice(allCheckboxesChecked ? totalPrice : 0);
        setCount(totalCount);
      
        const allCheckboxes = document.querySelectorAll<HTMLInputElement>(
          'input[type="checkbox"]'
        );
        allCheckboxes.forEach((checkbox) => {
          checkbox.checked = allCheckboxesChecked;
        });
      
        TotalCart(); // Call TotalCart after updating the selected property
      };
      
      
      const TotalCart = () => {
        let Total = 0;
        newCart.forEach((item) => {
          if (item.selected) {
            Total += item.product_price * item.product_pcs;
          }
        });
      
        setPrice(Total);
      };
    useEffect(() => {
        TotalCart()
    }, [TotalCart])
   
    // const TotalCart2 = () => {
    //     let Total = 0
    //     newCart.map((i) => {
    //         Total += i.product_price * i.product_pcs
    //     })
    //     setPrice(Total)
    // }

    // useEffect(() => {
    //     TotalCart2()
    // }, [TotalCart2])
      
    const test = newCart
    // console.log('tesss newcar', test);
    
    const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, productPrice: number) => {
        const allCheckboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        const allCheckboxesChecked = Array.from(allCheckboxes).every(
            (checkbox) => checkbox.checked
        );
        setChecked(allCheckboxesChecked);
        if (e.target.checked) {
            setPrice(totalPrice + productPrice);
        } else {
            setPrice(Math.max(totalPrice - productPrice, 0));
        }
    };

    console.log('test count', count);

    console.log('cektotal', totalPrice);
    console.log('cekt newCart', newCart);
    console.log('ceck cart', cart);
    console.log(price)
    console.log('ceck count', count)

    const getProfile = async () => {
        setLoading(true)
        try {
            const res = await axios.get('https://lapakumkm.mindd.site/users', {
                headers: {
                    Authorization: `Bearer ${cookies.token}`
                }
            })
            setData(res.data.data)
        } catch (error) {

        }
        setLoading(false)
    }

    useEffect(() => {
                getProfile()
    }, [])


    const cartEndPoint = 'https://lapakumkm.mindd.site/carts'

    const fetchDataCart = async () => {
        try {
            const response = await axios.get('https://virtserver.swaggerhub.com/UMARUUUN11_1/ALTA-LapakUMKM/1.0.0/carts', {
                headers: {
                    Authorization: `Bearer ${cookies.token}`
                }
            });
            const data = response.data.data
            nsetNewCart(data);
            setCount(response.data.data.product_pcs)
        } catch (error) {
            console.log(error);
        } finally {

        }
    };

    useEffect(() => {
        fetchDataCart()
    }, [])

    return (
        <Layout>
            <Navbar
                imgUser={data.photo_profile ? data.photo_profile : FotoProfile}
                name={data.full_name}
                email={data.email}
            />
            <div className="flex flex-row mx-auto space-x-20 relative justify-center box-content border shadow-xl mt-20 w-[1200px] bg-white p-10">
                <div className="flex ">
                    <div className="block w-sm space-y-5 p-6 w-[700px] bg-white border border-gray-200 rounded-lg shadow">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Keranjang</h5>
                        <div className="flex flex-col">
                            <thead>
                                <tr>
                                    <th>
                                        <label>
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                checked={checked}
                                                onChange={handleCheckAll}
                                            />
                                        </label>
                                    </th>
                                    <th>Check All</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item: any) => (
                                    <tr>
                                        <th>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    className="checkbox"
                                                    onChange={(e) => handleCheckboxChange(e, item)}
                                                />
                                            </label>
                                        </th>
                                        <th>
                                            <CartCard
                                                key={item.id}
                                                id={"keranjang"}
                                                img={FotoProfile}
                                                sellerName={item.lapak_name}
                                                produkName={item.product_name}
                                                produkimg={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRw37WfMabYiFV2do0nCsvnLfyARz7ePSJwSAOjtqF1w&s'}
                                                counts={ item.product_pcs}
                                                price={item.product_price}
                                                onCheck={handleCheckAll}
                                                
                                                totalPrice={item.product_price * item.product_pcs}
                                                handleDecrement={() => handleDecrement(item)}
                                                handleIncrement={() => handleIncrement(item)}
                                            />
                                        </th>

                                    </tr>

                                ))}
                            </tbody>
                        </div>
                    </div>
                </div>
                <div className="flex mr-auto h-40 sticky-top">
                    <div className="block w-96 p-6 bg-white border border-gray-200 rounded-xl shadow hover:bg-gray-100">
                        <div className="flex justify-between border-b-2">
                            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">Total Harga</h5>
                            <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900"> {formatValue({
                                value: JSON.stringify(price),
                                groupSeparator: '.',
                                decimalSeparator: ',',
                                prefix: 'Rp. ',
                            })}</h5>
                        </div>
                        <div className="my-5 mx-auto w-40">
                            <CustomButton
                                id='submit'
                                label='Beli'
                            />
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Cart