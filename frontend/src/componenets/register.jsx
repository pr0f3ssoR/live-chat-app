import { useState } from 'react';
import { User, } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Register } from '../utilites/apicalls';
import { InvalidAlert, InvalidField } from '../utilites/alerts';
// Register Component
const RegisterPage = ({ onRegister, switchToLogin, setAuth }) => {

    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    const defaultInvalidState = {
    first_name: { isInvalid: false, message: '' },
    last_name: { isInvalid: false, message: '' },
    username: { isInvalid: false, message: '' },
    email: { isInvalid: false, message: '' },
    password: { isInvalid: false, message: '' },
};

    const [invalid, setInvalid] = useState(defaultInvalidState);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setInvalid({...defaultInvalidState})
        // if (formData.password !== formData.confirm_password) {
        //     alert('Passwords do not match');
        //     return;
        // }
        // Handle registration logic here
        const [success, res] = await Register(formData);
        console.log(res.data)
        if (!success) {
            // handleInvalidFields(res.data)
        }
        else{
            setAuth(res.data.token)
            localStorage.setItem('token',res.data.token)
            navigate('/')
        }
    };

    const handleInvalidFields = (errors)=>{
        setInvalid((prev)=>{
            const updateState = {...prev};
            for (let key in errors){
                updateState[key].isInvalid = true
                updateState[key].message = errors[key][0]
            }
            return updateState
        })
    }

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-white/70">Join the conversation today</p>
                </div>

                <div className="space-y-5">
                    {invalid.first_name.isInvalid && <InvalidField text={invalid.first_name.message}/>}
                    <div>
                        <input
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-white/5 border ${invalid.first_name.isInvalid ? 'border-red-400': 'border-white/20 focus:border-indigo-500 transition-all duration-300`'} rounded-xl text-white placeholder-white/50 focus:outline-none`}
                            required
                        />
                    </div>
                    {invalid.last_name.isInvalid && <InvalidField text={invalid.last_name.message}/>}
                    <div>
                        <input
                            type="text"
                            name="last_name"
                            placeholder="Last Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-white/5 border ${invalid.last_name.isInvalid ? 'border-red-400': 'border-white/20 focus:border-indigo-500 transition-all duration-300`'} rounded-xl text-white placeholder-white/50 focus:outline-none`}
                            required
                        />
                    </div>
                    {invalid.username.isInvalid && <InvalidField text={invalid.username.message}/>}
                    <div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-white/5 border ${invalid.username.isInvalid ? 'border-red-400': 'border-white/20 focus:border-indigo-500 transition-all duration-300`'} rounded-xl text-white placeholder-white/50 focus:outline-none`}
                            required
                        />
                    </div>
                    {invalid.email.isInvalid && <InvalidField text={invalid.email.message}/>}
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-white/5 border ${invalid.email.isInvalid ? 'border-red-400': 'border-white/20 focus:border-indigo-500 transition-all duration-300`'} rounded-xl text-white placeholder-white/50 focus:outline-none`}
                            required
                        />
                    </div>
                    {invalid.password.isInvalid && <InvalidField text={invalid.password.message}/>}
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-white/5 border ${invalid.password.isInvalid ? 'border-red-400': 'border-white/20 focus:border-indigo-500 transition-all duration-300`'} rounded-xl text-white placeholder-white/50 focus:outline-none`}
                            required
                        />
                    </div>
                   {invalid.password.isInvalid && <InvalidField text={invalid.password.message}/>}
                    <div>
                        <input
                            type="password"
                            name="confirm_password"
                            placeholder="Confirm Password"
                            value={formData.confirm_password}
                            onChange={handleInputChange}
                            className={`w-full px-4 py-3 bg-white/5 border ${invalid.password.isInvalid ? 'border-red-400': 'border-white/20 focus:border-indigo-500 transition-all duration-300`'} rounded-xl text-white placeholder-white/50 focus:outline-none`}
                            required
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        Create Account
                    </button>
                    {/* </div> className="space-y-5"> */}

                    <div className="text-center mt-6">
                        <p className="text-white/70">
                            Already have an account?{' '}
                            <Link to={'/'}
                                onClick={switchToLogin}
                                className="text-indigo-300 hover:text-indigo-200 font-semibold transition-colors duration-300"
                            >
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage