import React from 'react'
import { PiHandWaving } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  return (
    <div>
        <div className='w-1/2'>

        </div>

        <div className='w-1/3 float-right'>
          <div className="hero">
            <div className="hero-content flex-col lg:flex-row-reverse w-full">
              {/*form size */}
              <div className="card bg-base-200 w-full max-w-3xl">
                <form className="card-body w-full">
                  {/* Added Login Title */}
                  <h3 className="text-lg font-bold text-start text-blue mb-1">Login</h3>
                  <h4 className="text-lg font-bold text-start text-blue mb-1 flex items-center gap-2">
                        Welcome Back <PiHandWaving className="text-yellow-500 text-2xl" />
                    </h4>                 
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text-bo text-dark">Email</span>
                    </label>
                    <input type="email" placeholder="Email" className="input input-bordered input-sm"  
                     required />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-dark">Password</span>
                    </label>
                    <input type="password" placeholder="assword" className="input input-bordered input-sm"  
                       required />
                        <label className="label gap-2">
                      <p className='label-text text-black text-center'>
                        or 
                      </p>
                      </label>
                      <label className='justify-items-center'>
                        <button className="flex items-center gap-2 px-4 py-1 bg-base-200 text-black rounded hover:bg-base-300"><FcGoogle />Signup with Google</button>
                      </label>
                    <label className="label">
                      <p className='label-text text-black'>
                        Don't have an account? <a href='/signup' className="label-text-alt link link-hover text-blue-600 hover:text-red-800 transition-colors duration-300 ">SignUp Now</a>
                      </p>
                    </label>
                  </div>
                  <div className="form-control mt-1">
                    <button type="submit" className="btn bg-blue-600 text-white text-lg hover:bg-blue-950" >Login</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        </div>

  )
}

export default Login