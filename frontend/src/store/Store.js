import React, {useEffect} from 'react'
//import {AuthContext} from "../App";
import Spinner from '../components/spinner/Spinner';
import Modal from "../components/modal/Modal";
import '../css/bootstrap-grid.min.css';
export const Store = () => {
const initialState = {
    stores: [],
    selectedStore: null,
    isLoading: false,
    errorMessage: null,
    isDelete: false,
};
const selectedStore = {
    
};
const [data, setData] = React.useState(initialState);
const [storeData, setStoreData] = React.useState(selectedStore);
const modalCancelHandler = () => {
    setData({
        ...data,
        selectedStore: null,
        isDelete: false
    });
};
const modalConfirmHandler = async () => {
    setData({
        ...data,
        isLoading: true
    });
    const requestBody = {
        query: `
        `,
        variables: {

        }
    };
    const response = await (await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    })).json();
    console.log('response', response);
    const selectedStoreIndex = data.stores.findIndex(store => store._id === data.selectedStore);
    //data.stores[selectedStoreIndex] = response.;
    setData({
        ...data,
        isLoading: false,
    });
};
const StoresFetch = () => {
    useEffect(() => {
    setData({
        ...data,
        isLoading: true,
    });
    const requestBody = {
        query: `
                    query Stores {
                        stores {
                            _id
                            code
                            updateAt
                            storeAdmin {
                                _id
                                name
                            }
                        }
                    }
                `
    };
        async function storesFetch() {
            const response = await (await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            })).json();
            console.log('resStores', response);
            setData({
                ...data,
                stores: response.errors ? [] : response.data.stores.sort((a, b) => a.updateAt > b.updateAt ? 1: -1),
                isLoading: false
            });
        }
        storesFetch();
    }, []);
};
StoresFetch();

    return (
        <div className="initial container">
            {data.isLoading ? <Spinner/> : data.stores.length === 0 ? <h1>Não há lojas cadastradas</h1> :
                <div className="row">
                    <table className="col-6">
                        <thead>
                            <h1>Lojas</h1>
                            <tr>
                                <th>Código</th>
                                <th>Nome</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                        {data.stores.map(store => (
                            <tr key={store.id}>
                                <td>{store.code}</td>
                                <td>{store.storeAdmin.name}</td>
                                <td>
                                    <button onClick={() => setData({...data, selectedStore: store._id})}>Editar</button>
                                    <button onClick={() => {setData({...data, selectedStore: store._id, isDelete: true})}}>Excluir</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {data.selectedStore ? data.isDelete ?
                        <Modal
                            title="Excluir loja"
                            canCancel
                            canConfirm
                            onCancel={modalCancelHandler}
                            onConfirm={modalConfirmHandler}
                            >
                        <h2>A seguinte loja sera excluida:<br/>{data.stores.find(store => store._id === data.selectedStore).storeAdmin.name}</h2>
                        </Modal> :
                        <div className="col-6">
                            bla
                        </div> :
                        <br/>
                    }
                </div>}
        </div>
    );
};

export default Store;