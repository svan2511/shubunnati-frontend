import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { fetchUserLogin } from "../userSlice";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const loadingText = useSelector((state) => state.loggedUser.loadingText );
  const isAuthenticated = useSelector((state) => state.loggedUser.isAuthenticated );
  const responseMsg = useSelector((state) => state.loggedUser.responseMsg );
  const dispatch = useDispatch();


  const getFormdata = (data) =>  {
    dispatch(fetchUserLogin(data));
  }

  return (
    <>
     {isAuthenticated && <Navigate to="/dashboard" replace={true}></Navigate> }
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form action="#" method="POST" className="space-y-6" onSubmit={handleSubmit(getFormdata)}>
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  
                  autoComplete="email"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                  {...register("email" , {required:"Email is required"})}
                />
              { errors.email && <p className="block text-sm/6 font-medium text-gray-100">{errors.email.message}</p> }

              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
                  Password
                </label>
                <div className="text-sm">
                  {/* <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                    Forgot password?
                  </a> */}
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                 {...register("password" , {required:"Password is required"})}

                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
                { errors.password && <p className="block text-sm/6 font-medium text-gray-100">{errors.password.message}</p> }

              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
               {loadingText}
              </button>
            </div>
          </form>
          {responseMsg && <p className="block text-sm/6 font-medium text-gray-100 mt-4">{responseMsg}</p> }

          <p className="mt-10 text-center text-sm/6 text-gray-400">
            
            <Link to={'/'} className="font-semibold text-indigo-400 hover:text-indigo-300">
              Go Back to Home
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

