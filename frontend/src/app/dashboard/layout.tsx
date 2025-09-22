import { ImageProvider } from "./context/use-image"
import { ThumbnaillProvider } from "./context/use-thumbnaill"

const DashboardLayout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ImageProvider>
      <ThumbnaillProvider>
        {children}
      </ThumbnaillProvider>
    </ImageProvider>
  )
}

export default DashboardLayout