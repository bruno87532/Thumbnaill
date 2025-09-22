import { ImageProvider } from "./context/use-image"

const DashboardLayout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ImageProvider>
      {children}
    </ImageProvider>
  )
}

export default DashboardLayout