import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Navbar from '../components/Navbar'
import { MdOutlineLocationOn } from 'react-icons/md'
import FotoProfile from '../assets/photo_2023-03-16_20-34-20.jpg'
import { BsChatText } from 'react-icons/bs'
import ProdukCard from '../components/ProdukCard'
import ChatModal from '../components/ChatModal'
import axios from 'axios'
import Loading from '../components/Loading'
import { useParams } from 'react-router-dom'
const Toko = () => {
    const [showChat, setShowChat] = useState(false)
    const [loading, setLoading] = useState(false)
    const { id } = useParams()

    const [data, setData] = useState([])
    const [getUserToko, setUserToko] = useState('')
    const [tokoName, setTokoName] = useState('')
    const [address, setAddress] = useState('')
    const [foto, setFoto] = useState('')
    const [fullName, setFullName] = useState('')
    const getPrudukToko = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`https://lapakumkm.mindd.site/products?userId=${id}`)
            const {address, full_name , photo_profile, shop_name} = res.data.data[0].user
            setTokoName(shop_name)
            setAddress(address)
            setFoto(photo_profile)
            setFullName(fullName)
            setData(res.data.data)
        } catch (error) {

        }
        setLoading(false)
    }
    useEffect(() => {
        getPrudukToko()
    }, [])

    console.log('test data toko', data);
    console.log('ambil data toko', getUserToko);
    const imgUrl = 'https://storage.googleapis.com/images_lapak_umkm/product/' + foto

    console.log(imgUrl);
    
    return (
        <Layout>
            <Navbar />
            {loading ? <Loading /> :
                <>
                    {/* chat */}
                    <ChatModal
                        img={FotoProfile}
                        isOpen={showChat}
                        isClose={() => setShowChat(false)}
                    >
                        <div className="chat chat-start">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img src={FotoProfile} />
                                </div>
                            </div>
                            <div className="chat-header">
                                Obi-Wan Kenobi
                            </div>
                            <div className="chat-bubble">You were the Chosen One! Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia sequi assumenda eveniet accusantium tempora dolore dolorum fugiat doloremque rerum possimus commodi ipsam illum, dolor laborum harum voluptatibus unde maiores voluptates.</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img src={FotoProfile} />
                                </div>
                            </div>
                            <div className="chat-header">
                                Anakin
                            </div>
                            <div className="chat-bubble bg-lapak">I hate you! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam voluptatem architecto deleniti error nisi quam eveniet tenetur veniam, ab ducimus eaque soluta numquam consequatur unde nostrum qui magnam alias commodi!</div>
                        </div>
                    </ChatModal>
                    {/*test card  */}
                    {/* from-green-300 via-blue-500 to-purple-600 */}
                    {/*  */}
                    {/*  */}
                    <div className='flex flex-col mx-auto'>
                        <div className='flex flex-col rounded-md bg-white border-lapak border-b-4 mt-5 mb-5 p-10 w-[500px] mx-auto shadow-lg'>
                            <div className='flex w-fit gap-5 '>
                                <img src={imgUrl} className='w-40 rounded-full' />
                                <div className='font-bold text-lg'>
                                    <h1 className='mb-5'>{tokoName}</h1>
                                    <h1 className='flex items-center'><MdOutlineLocationOn /> {address}</h1>
                                </div>
                            </div>
                            <div className='flex justify-center mt-7 '>
                                <button className='btn btn-ghost bg-lapak rounded-xl items-center justify-center hover:bg-lapak text-white' onClick={() => setShowChat(true)}>
                                    <span className='mr-4 '>Chat penjual </span><BsChatText size={20} />
                                </button>
                            </div>
                        </div>


                        <div className='mt-10'>
                           <div className='flex flex-col items-center gap-5 justify-center'>
                            <h1 className='text-2xl font-semibold ml-1'>Produk Penjual</h1>
                           <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
                                {
                                    data?.map((item: any, i: number) => {
                                        return (
                                            <ProdukCard
                                                produkName={item.product_name}
                                                location='jakarta'
                                                sell={item.stock_sold}
                                                id={i}
                                                key={i}
                                                image={'https://sellercenter.unkl-ns.com/gallery/items/604/img_604_i55_3_1667709495.jpg'}
                                                rating={4}
                                                price={item.price}
                                            />
                                        )
                                    })

                                }

                            </div>
                           </div>
                        </div>
                    </div>
                </>
            }

        </Layout>
    )
}

export default Toko