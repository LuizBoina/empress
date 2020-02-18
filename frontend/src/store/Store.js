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
    const selectedStoreData = {
        isActivated: true,
        storeAdmin: "",
        code: "",
        cnpj: "",
        lat: "",
        lng: "",
        options: [],
        acceptPicPay: false,
        picPayAccount: "",
        email: "",
        name: "",
        phoneNumber: ""
    };
    const [data, setData] = React.useState(initialState);
    const [storeData, setStoreData] = React.useState(selectedStoreData);
    const handleInputChange = event => {
        setStoreData({
            ...storeData,
            [event.target.name]: event.target.value,
        });
    };
    const handleModalCancel = () => {
        setData({
            ...data,
            selectedStore: null,
            isDelete: false
        });
    };
    const handleModalConfirm = async () => {
        setData({
            ...data,
            isLoading: true
        });
        const deleteReqBody = {
            query: `
                mutation Delete($userId: ID!, $storeId: ID!){
                    deleteUser(userId: $userId)
                    deleteStore(storeId: $storeId)
                }
            `,
            variables: {
                userId: data.stores.find(store => store._id === data.selectedStore).storeAdmin._id,
                storeId: data.selectedStore
            }
        };
        const response = await fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(deleteReqBody),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setData({
            ...data,
            stores: response.ok ? data.stores.filter(store => store._id !== data.selectedStore) : data.stores,
            isLoading: false,
            selectedStore: null,
            isDelete: false
        });
    };
    const handleAddOption = () => {
        const options = [...storeData.options];
        options.push({name: "", price: -1});
        setStoreData({
            ...storeData,
            options: options
        });
    };
    const handleChangeOption = (event, i) => {
        console.log('event.target.value', event.target.value, 'event.target.name', event.target.name);
        const options = [...storeData.options];
        if(event.target.name === 'price')
            options[i].price = event.target.value;
        else
            options[i].name = event.target.value;
        setStoreData({
            ...storeData,
            options: options
        });
    };
    const handleRemoveOptions = (i) => {
        let options = [...storeData.options];
        options.splice(i, 1);
        setStoreData({
            ...storeData,
            options: options
        });
    };
    const handleCancelUpdate = () => {
        setData({
            ...data,
            selectedStore: null
        });
        setStoreData(selectedStoreData);
    };
    const handleStoreUpdate = async () => {
        setData({
            ...data,
            isLoading: true
        });
        const userRequestBody = {
            query: `
                mutation UpdateUser($userId: ID!, $email: String!, $name: String!, $phoneNumber: String!, $password: String!, $role: String!) {
                    updateUser(userId: $userId, userInput: {email: $email, name: $name, phoneNumber: $phoneNumber, password: $password, role: $role}) {
                        _id
                    }
                }`,
            variables: {
                userId: storeData.storeAdmin._id,
                email: storeData.email,
                name: storeData.name,
                phoneNumber: storeData.phoneNumber,
                password: storeData.password,
                role: "employee",
            },
        };
        const resUser = await (await fetch('http://localhost:8000/graphql', {
            method: 'POST',
            body: JSON.stringify(userRequestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        })).json();
        if (resUser.data.updateUser) {
            storeData.options.forEach( option => {
                option.price = parseFloat(option.price)
            });
            const storeRequestBody = {
                query: `
                    mutation UpdateStore($storeId: ID!, $storeAdmin: ID!, $cnpj: String!, $latLng: LatLngInput!, $acceptPicPay: Boolean!, $picPayAccount: String, $options: [OptionInput!]!) {
                        updateStore(storeId: $storeId, storeInput: {storeAdmin: $storeAdmin, cnpj: $cnpj, latLng: $latLng, acceptPicPay: $acceptPicPay, picPayAccount: $picPayAccount, options: $options}) {
                            _id
                            updateAt
                            code
                        }
                    }`,
                variables: {
                    storeId: data.selectedStore,
                    storeAdmin: resUser.data.updateUser._id,
                    cnpj: storeData.cnpj,
                    latLng: {lat: storeData.lat, lng: storeData.lng},
                    acceptPicPay: storeData.acceptPicPay,
                    picPayAccount: storeData.acceptPicPay ? storeData.picPayAccount : null,
                    options: storeData.options,
                    isActivated: storeData.isActivated
                },
            };
            const storeResponse = await (await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(storeRequestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            })).json();
            console.log('response-handleStoreUpdate', storeResponse);
            console.log('stores', data.stores);
            if(storeResponse.data.updateStore) {
                const selectedStoreIndex = data.stores.findIndex(store => store._id === data.selectedStore);
                console.log('selectedStoreIndex', selectedStoreIndex)
                const stores = data.stores;
                console.log('stores', stores)
                stores[selectedStoreIndex] = {
                            _id: data.selectedStore,
                            code: storeResponse.data.updateStore.code,
                            updateAt: Date.now(),
                            isActivated: storeData.isActivated,
                            storeAdmin: {
                                _id: storeData.storeAdmin._id,
                                name: storeData.storeAdmin.name
                            }
                };
                setData({
                    ...data,
                    stores: stores
                });
            }
            else
                setData({
                   ...data,
                   errorMessage: 'nao foi possivel atualizar loja'
                });
        } else
            setData({
                ...data,
                errorMessage: 'nao foi poosivel atualizar usuario'
            });
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
                            isActivated
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
                setData({
                    ...data,
                    stores: response.errors ? [] : response.data.stores.sort((a, b) =>
                        a.isActivated && b.isActivated && a.updateAt >= b.updateAt ? 1 : a.isActivated ? 1 : -1),
                    isLoading: false
                });
                    console.log('response-StoresFetch', response);
            }

            storesFetch();
        }, []);
    };
    StoresFetch();
    const StoreFetch = () => {
        useEffect(() => {
            if (data.selectedStore) {
                const storeReqBody = {
                    query: `
                    query Store($id: ID!) {
                        store(id: $id) {
                            _id
                            cnpj
                            acceptPicPay
                            picPayAccount
                            isActivated
                            latLng {
                                lat
                                lng
                            }
                            options {
                              name
                              price
                            }
                            storeAdmin {
                                _id
                                 name
                                 email
                                 phoneNumber
                                 password
                            }
                        }
                    }
                `,
                    variables: {
                        id: data.selectedStore
                    }
                };

                async function storeFetch() {
                    const response = await (await fetch('http://localhost:8000/graphql', {
                        method: 'POST',
                        body: JSON.stringify(storeReqBody),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })).json();
                    console.log('response', response);
                    if(!response.errors)
                        setStoreData({
                            storeAdmin: response.data.store.storeAdmin,
                            cnpj: response.data.store.cnpj,
                            lat: response.data.store.latLng.lat,
                            lng: response.data.store.latLng.lng,
                            isActivated: response.data.store.isActivated,
                            acceptPicPay: response.data.store.acceptPicPay,
                            picPayAccount: response.data.store.picPayAccount,
                            options: response.data.store.options,
                            email: response.data.store.storeAdmin.email,
                            name: response.data.store.storeAdmin.name,
                            phoneNumber: response.data.store.storeAdmin.phoneNumber,
                            password: response.data.store.storeAdmin.password
                        });
                }
                storeFetch();
            }
        }, [data.selectedStore]);
    };
    StoreFetch();
    return (
        <div className="initial container">
            {data.isLoading ? <Spinner/> : data.stores.length === 0 ? <h1>Não há lojas cadastradas</h1> :
                <div className="row">
                    <table className="col-5">
                        <thead>
                        <h1>Lojas</h1>
                        <tr>
                            <th>Código</th>
                            <th>Status</th>
                            <th>Nome</th>
                            <th>Ações</th>
                        </tr>
                        </thead>
                        <tbody className="stores-list">
                        {data.stores.map(store => (
                            <tr key={store.id}>
                                <td key={store.code}>{store.code}</td>
                                <td key={`${store.id}-bool`}>{store.isActivated? "Ativa" : "Inativa"}</td>
                                <td key={store.storeAdmin.name}>{store.storeAdmin.name}</td>
                                <td key={`${store.id}-options`}>
                                    <button key={`${store.id}-options-1`} onClick={() => setData({...data, selectedStore: store._id})}>Editar
                                    </button>
                                    <button key={`${store.id}-options-2`} onClick={() => setData({
                                        ...data,
                                        selectedStore: store._id,
                                        isDelete: true
                                    })}>Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {data.selectedStore ? data.isDelete ?
                        //**********************************   STORAGE DELETE ***************************************//
                        <Modal
                            title="Excluir loja"
                            canCancel
                            canConfirm
                            onCancel={handleModalCancel}
                            onConfirm={handleModalConfirm}
                        >
                            <h2>A seguinte loja sera
                                excluida:<br/>{data.stores.find(store => store._id === data.selectedStore).storeAdmin.name}
                            </h2>
                        </Modal> :
                        //**********************************   STORAGE UPDATE ***************************************//
                        <div className="col-7">
                            <div className="container">
                                <form  className="store-update" onSubmit={handleStoreUpdate}>
                                    <h1>Editar Loja</h1>

                                    <label htmlFor="email">
                                        Email
                                        <input
                                            type="text"
                                            value={storeData.email}
                                            onChange={handleInputChange}
                                            name="email"
                                            id="email"
                                        />
                                    </label>

                                    <label htmlFor="name">
                                        Nome
                                        <input
                                            type="text"
                                            value={storeData.name}
                                            onChange={handleInputChange}
                                            name="name"
                                            id="name"
                                        />
                                    </label>

                                    <label htmlFor="phoneNumber">
                                        Telefone
                                        <input
                                            type="text"
                                            value={storeData.phoneNumber}
                                            onChange={handleInputChange}
                                            name="phoneNumber"
                                            id="phoneNumber"
                                        />
                                    </label>

                                    <label htmlFor="cnpj">
                                        CNPJ
                                        <input
                                            type="text"
                                            value={storeData.cnpj}
                                            onChange={handleInputChange}
                                            name="cnpj"
                                            id="cnpj"
                                        />
                                    </label>

                                    <label htmlFor="latLng" className="inline-label">
                                        <div className="lat">
                                            Latitude<br/>
                                            <input
                                                type="text"
                                                value={storeData.lat}
                                                onChange={handleInputChange}
                                                name="lat"
                                                id="lat"
                                            />
                                        </div>
                                        <div className="lng">
                                            Longitude<br/>
                                            <input
                                                type="text"
                                                value={storeData.lng}
                                                onChange={handleInputChange}
                                                name="lng"
                                                id="lng"
                                            />
                                        </div>
                                    </label>
                                    <br/>
                                    <label htmlFor="options">
                                        <div className="container">
                                        Opções de impressão<br/><br/>
                                        {storeData.options.map( (option, i) => (
                                        <div className="row store-update">
                                            <div className="col-5">
                                                Nome
                                                <input
                                                    type="text"
                                                    value={storeData.options[i].name}
                                                    onChange={e => handleChangeOption(e, i)}
                                                    name="name"
                                                    id={option.name}
                                                />
                                            </div>
                                            <div className="col-5">
                                                Preço/folha
                                                <input
                                                    type="number"
                                                    value={storeData.options[i].price === -1 ? "" : storeData.options[i].price}
                                                    onChange={e => handleChangeOption(e, i)}
                                                    name="price"
                                                    id={option.name.concat(' price')}
                                                />
                                            </div>
                                            <div className="col-2">
                                                <button type="button"
                                                    className="remove-option"
                                                    onClick={() => handleRemoveOptions(i)}>
                                                </button>
                                            </div>
                                        </div>)
                                        )}
                                        <div className="row">
                                            <button type="button"
                                                className="add-option"
                                                onClick={() => handleAddOption()}>
                                            </button>
                                        </div>
                                        </div>
                                    </label>

                                    <label htmlFor="isActivated" className="inline-label">
                                        Loja ativa
                                        <input
                                            type="checkbox"
                                            value={storeData.isActivated}
                                            checked={storeData.isActivated}
                                            name="isActivated"
                                            id="isActivated"
                                            onChange={() => {
                                                setStoreData({
                                                    ...storeData,
                                                    isActivated: !storeData.acceptPicPay
                                                });
                                            }}
                                        />
                                    </label>
                                    <br/>
                                    <label htmlFor="acceptPicPay" className="inline-label">
                                        Aceita PicPay
                                        <input
                                            type="checkbox"
                                            value={storeData.acceptPicPay}
                                            checked={storeData.acceptPicPay}
                                            name="acceptPicPay"
                                            id="acceptPicPay"
                                            onChange={() => {
                                                setStoreData({
                                                    ...storeData,
                                                    acceptPicPay: !storeData.acceptPicPay
                                                });
                                            }}
                                        />
                                    </label>
                                    <br/>
                                    {storeData.acceptPicPay &&
                                    <label htmlFor="picPayAccount" className="PicPayAccount-label">
                                        Conta PicPay
                                        <input
                                            type="text"
                                            value={storeData.picPayAccount}
                                            onChange={handleInputChange}
                                            name="picPayAccount"
                                            id="picPayAccount"
                                        />
                                    </label>}

                                    {data.errorMessage && (
                                        <span className="form-error">{data.errorMessage}</span>
                                    )}

                                    <button disabled={data.isSubmitting} type="submit">
                                        {data.isSubmitting ? (
                                            "Carregando..."
                                        ) : (
                                            "Salvar"
                                        )}
                                    </button>
                                    <button disabled={data.isSubmitting}
                                            onClick={handleCancelUpdate}>
                                        Cancelar
                                    </button>
                                </form>
                            </div>
                        </div> :
                        <br/>
                    }
                </div>}
        </div>
    );
};

export default Store;