import React, {useState} from 'react';
import './ProductList.css';
import { ProductItem } from './ProductItem/ProductItem';
import { useTelegram } from '../../hooks/useTelegram';
import { useCallback, useEffect} from 'react';
const products = [
    {id: '1', title: 'Джинсы', price: 790, description:'Синего цвета, прямые, XS(164см, 50-60кг)', img: 'https://static.detmir.st/media_pim/128/978/4978128/450/1.jpg?1669368015120'},
    {id: '2', title: 'Куртка', price: 1200, description:'Черного цвета, теплая, M(173-178см, 67-77кг)', img: 'https://fridaywear.ru/upload/iblock/b54/b54a2767617f37db8a9dcc77bf09a290.jpg'},
    {id: '3', title: 'Джогеры', price: 590, description:'Черного цвета, дырявые, XXXL(194-198см, 106-112кг)', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1nJtghf25ME-JXujhTlR44jS53qV1zyQbBA&usqp=CAU'},
    {id: '4', title: 'Куртка Спортивная', price: 640, description:'Белого цвета, Abibas, L(178-184см, 76-85кг)', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIYIS61qZfrcgJK4qEBCd_cQvGwy2tJW78rQ&usqp=CAU'},
    {id: '5', title: 'Бананы', price: 900, description:'Синего цвета, XXL(189-194см, 95-105кг)', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmCDWMiOhWd8P8hmOdmZ05Q2Ke8OheOHeyeg&usqp=CAU'},
    {id: '6', title: 'Ветровка на молнии', price: 780, description:'Голубая, XS(164см, 50-60кг)', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnThZJNDOTa507SPQLBlDMtiDL-mXj1Zrhrg&usqp=CAU'},
    {id: '7', title: 'Трико', price: 550, description:'Серого цвета, для лета, XL(184-189см, 85-95)', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0GVSIhz8t57RFXA9o9c1pvczURQei4lRHFg&usqp=CAU'},
    {id: '8', title: 'Ветровка с капюшоном', price: 1200, description:'Зеленого цвета, холодная, XL(184-189см, 85-95кг)', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaz4XxZg_vxTJnJtl9pRS4idvbvOlJuo_cm7A8VU3x855DMlsokIdFOGzeP9FS8v9vplE&usqp=CAU'},
]
const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}
export const ProductList = () => {
     
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();
    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])
    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])
    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];
        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        }else{
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        }else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }
    
    return(
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                product={item}
                onAdd={onAdd}
                className={'item'}
                />
            ))}
        </div>
    );
};