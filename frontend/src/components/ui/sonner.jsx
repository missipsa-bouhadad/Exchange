import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as SonnerToaster } from "sonner"

const CustomToaster = (props) => {
  const { theme = "system" } = useTheme()

  return (
    <SonnerToaster
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={{
        "--normal-bg": "var(--color-blanc)",
        "--normal-text": "var(--color-mauve-fonce)",
        "--normal-border": "var(--color-mauve-clair)",
        "--border-radius": "var(--radius)",
      }}
      {...props}
    />
  )
}

export { CustomToaster }
