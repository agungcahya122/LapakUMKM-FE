import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Layout from '../components/Layout'
import FotoProfile from '../assets/photo_2023-03-16_20-34-20.jpg'
import ProdukCard from '../components/ProdukCard'
import { Rating } from '@smastrom/react-rating';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Loading from '../components/Loading'
import Loading2 from '../components/Loading2'
import Search from '../components/Search'
import { useCookies } from 'react-cookie'
import { DataType } from '../utils/types/DataType'
import InfiniteScroll from "react-infinite-scroll-component"
import Swal from 'sweetalert2'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
    const navigate = useNavigate()
    const [kategori, setKategori] = useState('')
    const [data, setData] = useState<DataType[]>([])
    const [tenData, setTenData] = useState([])
    const [loading, setLoading] = useState(false)
    const [cookie, setCookie] = useCookies(["token", 'testSwal']);
    const [user, setUser] = useState<any>({})
    const [search, setSearch] = useState('')
    const [swal2, setSwal2] = useState(false)
    const [cekAddress, setCekAddress] = useState('')
    const notify = () => toast.info("Anda Belum Melengkapi Profile Anda");
    const getProfile = async () => {
        setLoading(true)
        try {
            const res = await axios.get('https://lapakumkm.mindd.site/users', {
                headers: {
                    Authorization: `Bearer ${cookie.token}`
                }
            })
            setUser(res.data.data)
            setCekAddress(res.data.data.address)


        } catch (error) {

        }
        setLoading(false)
    }
    console.log("user", user)
    let testSwal: any = ''
    const [isSwalDisplayed, setIsSwalDisplayed] = useState(false);

    useEffect(() => {
        if (cekAddress === undefined) {
            notify()
        }
    }, [cekAddress]);





    useEffect(() => {
        getProfile()
    }, [testSwal])
    const getAllData = () => {
        setLoading(true);

        axios
            .get(`https://lapakumkm.mindd.site/products`)
            .then((res) => {
                const { data } = res.data
                setData(data)
            })
            .then((err) => {

            })
            .finally(() => setLoading(false));
    }

    const [tambah, setTambah] = useState<number>(10);

    const handleScroll = (e: any) => {

        const scrollHeight = e.target.documentElement.scrollHeight;
        const currentHeight = Math.ceil(
            e.target.documentElement.scrollTop + window.innerHeight
        );

        console.log("current >:", currentHeight)
        console.log("scroll <:", scrollHeight)
        if (currentHeight + 10 >= scrollHeight) {
            // getAllData();
            setTambah(tambah + 5)
        }
    };

    useEffect(() => {
        getAllData();
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    console.log(data)
    console.log("tambah", tambah)


    // const LoadMore = () => {
    //     setLoad(load + 10);
    //     if (load >= data.length) {
    //         setFinis(true)
    //     } else {
    //         setFinis(false)
    //     }
    // }


    // useEffect(() => {
    //     if (load >= data.length) {
    //         setFinis(true);
    //     } else {
    //         setFinis(false);
    //     }
    // }, [load, data]);


    const [category, setCategory] = useState<any>([])
    const categoryEndpoint = 'https://lapakumkm.mindd.site/categories'

    const fetchCategory = async () => {
        try {
            const res = await axios.get(categoryEndpoint, {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InVzZXIiLCJleHAiOjE2Nzk5MTc2MjN9.K8lerhsq124A_-y4Lf8gNAPIJtLe9xRUMLKjN_tWIZA`
                }
            })
            setCategory(res.data.data)
        } catch (error) {

        }
    }

    useEffect(() => {
        fetchCategory()
    }, [])
    console.log('data', data);
    const imgUrl = 'https://storage.googleapis.com/images_lapak_umkm/product/'
    return (
        <Layout>
            <Navbar
                children={<Search onSearch={(e) => setSearch(e.target.value)} />}
            />
            <ToastContainer
            className='toast-lapak'
                position="top-center"
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover
            />
            <div className="flex flex-col w-11/12 mx-auto items-center">
                <div className="mt-10 mx-auto w-3/6">
                    <p className='dark:text-white font-semibold text-sm md:text-lg lg:text-xl'>Cari Berdasarkan Kategori</p>
                    <div className="flex w-full space-x-10 relative overflow-x-auto p-5">
                        {category?.map((item: any, index: any) => {
                            console.log("item test", item);

                            return (
                                <button key={index} id={item.id} className="btn w-32 bg-white text-slate-800 border-gray-200 shadow hover:bg-lapak hover:border-none dark:border-lapak dark:border-2 dark:bg-slate-700 dark:text-white"
                                    onClick={() => navigate(`/home/${item.category}`, {
                                        state: {
                                            id: item.id
                                        }
                                    })}>{item.category}</button>
                            )
                        })
                        }
                    </div>
                </div>
                <div className="my-4 gap-y-5 gap-x-5 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 mx-auto mt-10">

                    {
                        loading ? <Loading /> :
                            data?.filter((item: any) => {
                                return search.toLocaleLowerCase() === "" ?
                                    item : item.product_name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
                            }).slice(0, tambah).map((item: any, index) => {
                                // console.log('test', item);

                                return (
                                    <ProdukCard
                                        size={item.size}
                                        key={index}
                                        produkName={item.product_name}
                                        location={item.user.address}
                                        sell={item.stock_sold}
                                        id={item.id}
                                        image={item.product_image ? item.product_image[0].image : 'https://sellercenter.unkl-ns.com/gallery/items/604/img_604_i55_3_1667709495.jpg'}
                                        rating={4}
                                        price={item.price}
                                    />
                                )
                            }
                            )
                    }
                </div>
                <div className='mb-20 mt-10'>
                    {/* <CustomButton
                            id="btn- loadmore"
                            label="Lihat lebih banyak"
                            onClick={LoadMore}
                        /> */}
                </div>
            </div>
        </Layout >

    )
}

export default Home