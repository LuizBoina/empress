import React from "react";
import {/*AuthContext,*/ PageContext} from "../App";
export const CreateStore = () => {
    //const {dispatch} = React.useContext(AuthContext);
    const {setPage} = React.useContext(PageContext);
    const initialState = {
        email: "",
        name: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        cnpj: "",
        lat: "",
        lng: "",
        acceptPicPay: false,
        picPayAccount: "",
        isSubmitting: false,
        errorMessage: null
    };
    const [data, setData] = React.useState(initialState);
    const handleInputChange = event => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };
    const handleFormSubmit = async event => {
        event.preventDefault();
        setData({
            ...data,
            isSubmitting: true,
            errorMessage: null
        });
        if (data.password !== data.confirmPassword) {
            setData({
                ...data,
                isSubmitting: false,
                errorMessage: "Senhas diferentes"
            });
            return;
        }
        if (data.password.trim().length === 0 || data.email.trim().length === 0 || data.name.trim().length === 0
            || data.phoneNumber.trim().length === 0 || data.cnpj.trim().length === 0
            || data.lat.trim().length === 0 || data.lng.trim().length === 0) {
            setData({
                ...data,
                isSubmitting: false,
                errorMessage: "Complete todos os campos"
            });
            return;
        }
        const userRequestBody = {
            query: `
                mutation CreateUser($email: String!, $name: String!, $phoneNumber: String!, $password: String!, $role: String!) {
                    createUser(userInput: {email: $email, name: $name, phoneNumber: $phoneNumber, password: $password, role: $role}) {
                        _id
                    }
                }`,
            variables: {
                email: data.email,
                name: data.name,
                phoneNumber: data.phoneNumber,
                password: data.password,
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
        if (resUser.data.createUser) {
            const storeRequestBody = {
                query: `
                    mutation CreateStore($storeAdmin: String!, $cnpj: String!, $latLng: LatLngInput!, $acceptPicPay: Boolean!, $picPayAccount: String) {
                        createStore(storeInput: {storeAdmin: $storeAdmin, cnpj: $cnpj, latLng: $latLng, acceptPicPay: $acceptPicPay, picPayAccount: $picPayAccount}) {
                            _id
                        }
                    }`,
                variables: {
                    storeAdmin: resUser.data.createUser._id,
                    cnpj: data.cnpj,
                    latLng: {lat: data.lat, lng: data.lng},
                    acceptPicPay: data.acceptPicPay,
                    picPayAccount: data.acceptPicPay ? data.picPayAccount : null,
                },
            };
            const resStore = await (await fetch('http://localhost:8000/graphql', {
                method: 'POST',
                body: JSON.stringify(storeRequestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            })).json();
            if (resStore.data.createStore) {
                setPage('VIEW_STORE');
            } else {
                const userDeleteRequestBody = {
                    query: `
                        mutation DeleteUser($userId: String!) {
                            deleteUser(userId: $userId)
                        }
                    `,
                    variables: {
                        userId: resUser.data.createUser._id
                    }
                };
                const resDel = await fetch('http://localhost:8000/graphql', {
                    method: 'POST',
                    body: JSON.stringify(userDeleteRequestBody),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (resDel.ok)
                    console.log('user deleted!');
                else
                    console.log('failed deleting user');
                setData({
                    ...data,
                    isSubmitting: false,
                    errorMessage: resStore.errors[0].message || resStore.statusText
                });
            }
        } else
            setData({
                ...data,
                isSubmitting: false,
                errorMessage: resUser.errors[0].message || resUser.statusText
            });
    };
    return (
        <div className="login-container">
            <div className="card-store">
                <div className="container">
                    <form onSubmit={handleFormSubmit}>
                        <h1>Criar nova loja</h1>

                        <label htmlFor="email">
                            Email
                            <input
                                type="text"
                                value={data.email}
                                onChange={handleInputChange}
                                name="email"
                                id="email"
                            />
                        </label>

                        <label htmlFor="name">
                            Nome
                            <input
                                type="text"
                                value={data.name}
                                onChange={handleInputChange}
                                name="name"
                                id="name"
                            />
                        </label>

                        <label htmlFor="phoneNumber">
                            Telefone
                            <input
                                type="text"
                                value={data.phoneNumber}
                                onChange={handleInputChange}
                                name="phoneNumber"
                                id="phoneNumber"
                            />
                        </label>

                        <label htmlFor="cnpj">
                            CNPJ
                            <input
                                type="text"
                                value={data.cnpj}
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
                                    value={data.lat}
                                    onChange={handleInputChange}
                                    name="lat"
                                    id="lat"
                                />
                            </div>
                            <div className="lng">
                                Longitude<br/>
                                <input
                                    type="text"
                                    value={data.lng}
                                    onChange={handleInputChange}
                                    name="lng"
                                    id="lng"
                                />
                            </div>
                        </label>

                        <label htmlFor="acceptPicPay" className="inline-label">
                            Aceita PicPay
                            <input
                                type="checkbox"
                                value={data.acceptPicPay}
                                onChange={() => {
                                    setData({
                                        ...data,
                                        acceptPicPay: !data.acceptPicPay
                                    });
                                }}
                                name="acceptPicPay"
                                id="acceptPicPay"
                            />
                        </label>

                        {data.acceptPicPay && <label htmlFor="picPayAccount" className="PicPayAccount-label">
                            Conta PicPay
                            <input
                                type="text"
                                value={data.picPayAccount}
                                onChange={handleInputChange}
                                name="picPayAccount"
                                id="picPayAccount"
                            />
                        </label>}

                        <label htmlFor="password">
                            Senha
                            <input
                                type="password"
                                value={data.password}
                                onChange={handleInputChange}
                                name="password"
                                id="password"
                            />
                        </label>

                        <label htmlFor="confirmPassword">
                            Confirmar senha
                            <input
                                type="password"
                                value={data.confirmPassword}
                                onChange={handleInputChange}
                                name="confirmPassword"
                                id="confirmPassword"
                            />
                        </label>

                        {data.errorMessage && (
                            <span className="form-error">{data.errorMessage}</span>
                        )}

                        <button disabled={data.isSubmitting}>
                            {data.isSubmitting ? (
                                "Carregando..."
                            ) : (
                                "Criar"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default CreateStore;