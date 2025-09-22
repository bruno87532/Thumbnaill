"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { AuthService } from "@/services/auth.service"
import { Form, FormMessage, FormLabel, FormField, FormItem, FormControl } from "@/components/ui/form"
import { AxiosError } from "axios"

const FormSchema = z.object({
  email: z.string().email("Informe um email válido"),
  password: z.string().min(1, "A senha é obrigatória"),
})

type FormSchema = z.infer<typeof FormSchema>

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSubmit = async (data: FormSchema) => {
    setIsLoading(true)
    try {
      await AuthService.login(data)
      router.push("/dashboard")
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        form.setError("password", {
          type: "manual",
          message: "Email ou senha inválido",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <div className="min-h-dvh w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-2 sm:p-4 overflow-hidden">
      <div className="max-h-dvh w-full flex items-center justify-center overflow-y-auto">
        <Card className="w-full max-w-[320px] sm:max-w-sm mx-auto shadow-lg">
          <CardHeader className="text-center space-y-2 p-4 sm:px-6 sm:pt-6">
            <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-balance">
              Criador de Thumbnaill
            </CardTitle>
            <CardDescription className="text-gray-600 text-xs sm:text-sm text-pretty">
              Faça login para acessar o gerador de Thumbnaill
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:px-6 sm:pb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 sm:space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" className="h-10 sm:h-11 text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-medium">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite a sua senha"
                            className="h-10 sm:h-11 pr-10 sm:pr-12 text-sm"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer" />
                            ) : (
                              <Eye className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-10 sm:h-11 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-sm sm:text-base cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Auth
