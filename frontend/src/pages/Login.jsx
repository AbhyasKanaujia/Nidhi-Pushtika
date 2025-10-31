import React, {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useAuth} from "../context/AuthContext"
import {useLocation, useNavigate} from "react-router-dom"
import {Button} from "../components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "../components/ui/form"
import {Input} from "../components/ui/input"
import {Alert, AlertDescription, AlertTitle} from "../components/ui/alert"
import {AlertCircle} from "lucide-react"
import {TypographyH1, TypographyMuted} from "@/components/ui/typography";
import {Loader} from "@/components/ui/loader.jsx"


const formSchema = z.object({
  email: z.email("Enter a valid email"), password: z.string().min(6, "Password must be at least 6 characters"),
})

const Login = () => {
  const {login, user} = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Get redirect param from query string or default to "/"
  const params = new URLSearchParams(location.search)
  const redirect = params.get("redirect") || "/"

  const form = useForm({
    resolver: zodResolver(formSchema), defaultValues: {
      email: "", password: "",
    },
  })

  useEffect(() => {
    if (user) {
      navigate(redirect, {replace: true})
    }
  }, [user, navigate, redirect])

  const onSubmit = async (values) => {
    setError(null)
    setLoading(true)

    try {
      const result = await login(values.email, values.password)
      if (!result.success) {
        throw new Error(result.message || "Login failed")
      }
      navigate(redirect, {replace: true})
    } catch (err) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (<div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-sm border rounded-lg p-6 shadow-sm">


        <TypographyH1 className="text-center mb-1">Nidhi Pushtika</TypographyH1>
        <TypographyMuted className="text-center mb-6">
          Login to your account
        </TypographyMuted>

        {error && (<Alert variant="destructive" className="mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4"/>
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>)}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (<FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>)}
            />

            <FormField
              control={form.control}
              name="password"
              render={({field}) => (<FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password"
                           autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage/>
                </FormItem>)}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (<>
                  <Loader className="mr-2 h-4 w-4"/>
                  Logging in...
                </>) : ("Login")}
            </Button>
          </form>
        </Form>
      </div>
    </div>)
}

export default Login
