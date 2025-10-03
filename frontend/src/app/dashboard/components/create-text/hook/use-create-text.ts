import { useState, useRef, useEffect } from "react"

interface TextLine {
  id: string
  text: string
  fontFamily: string
  oldFontFamily: string | null
  fontSize: number
  color: string
  fontWeight: number
  opacity: number
  italic: boolean
  underline: boolean
  bold: boolean
  strikethrough: boolean
  shadowOffsetX: number
  shadowOffsetY: number
  shadowBlur: number
  shadowColor: string
  strokeWidth: number
  strokeColor: string
}


export const useCreateText = () => {
  const fonts = [
    { value: "Arial", label: "Arial" },
    { value: "Arial Black", label: "Arial Black" },
    { value: "Verdana", label: "Verdana" },
    { value: "Tahoma", label: "Tahoma" },
    { value: "Trebuchet MS", label: "Trebuchet MS" },
    { value: "Impact", label: "Impact" },
    { value: "Georgia", label: "Georgia" },
    { value: "Palatino Linotype", label: "Palatino Linotype" },
    { value: "Times New Roman", label: "Times New Roman" },
    { value: "Courier New", label: "Courier New" },
    { value: "Lucida Console", label: "Lucida Console" },
    { value: "Monaco", label: "Monaco" },
    { value: "Comic Sans MS", label: "Comic Sans MS" },
    { value: "Brush Script MT", label: "Brush Script MT" },
    { value: "Lucida Handwriting", label: "Lucida Handwriting" },
    { value: "Copperplate", label: "Copperplate" },
    { value: "Papyrus", label: "Papyrus" },
    { value: "Garamond", label: "Garamond" },
    { value: "Bookman", label: "Bookman" },
    { value: "Century Gothic", label: "Century Gothic" },
    { value: "Candara", label: "Candara" },
    { value: "Franklin Gothic Medium", label: "Franklin Gothic Medium" },
    { value: "Gill Sans", label: "Gill Sans" },
    { value: "Helvetica", label: "Helvetica" },
    { value: "Optima", label: "Optima" },
    { value: "Segoe UI", label: "Segoe UI" },
    { value: "Calibri", label: "Calibri" },
    { value: "Cambria", label: "Cambria" },
    { value: "Consolas", label: "Consolas" },
    { value: "Rockwell", label: "Rockwell" },
    { value: "Anton", label: "Anton" },
    { value: "Bebas Neue", label: "Bebas Neue" },
    { value: "Oswald", label: "Oswald" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Poppins", label: "Poppins" },
    { value: "League Spartan", label: "League Spartan" },
    { value: "Luckiest Guy", label: "Luckiest Guy" },
    { value: "Lilita One", label: "Lilita One" },
  ]


  const [textLines, setTextLines] = useState<TextLine[]>([
    {
      id: "1",
      text: "Seu texto aqui",
      fontFamily: "Arial",
      oldFontFamily: "Arial",
      fontSize: 48,
      color: "#000000",
      fontWeight: 400,
      opacity: 100,
      italic: false,
      underline: false,
      bold: false,
      strikethrough: false,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 0,
      shadowColor: "#000000",
      strokeWidth: 0,
      strokeColor: "#000000",
    },
  ])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    updatePreview()
  }, [textLines])

  const updatePreview = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let totalHeight = 0
    const lineHeights: number[] = []
    let maxWidth = 0

    textLines.forEach((line) => {
      const fontStyle = line.italic ? "italic" : "normal"
      const fontWeight = line.bold ? 700 : line.fontWeight
      ctx.font = `${fontStyle} ${fontWeight} ${line.fontSize}px ${line.oldFontFamily ?? line.fontFamily}`

      const metrics = ctx.measureText(line.text)
      const lineWidth = metrics.width
      if (lineWidth > maxWidth) maxWidth = lineWidth

      const lineHeight = line.fontSize * 1.2
      lineHeights.push(lineHeight)
      totalHeight += lineHeight
    })

    const padding = 40 
    canvas.width = maxWidth + padding * 2
    canvas.height = totalHeight + padding * 2

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let currentY = padding
    textLines.forEach((line, index) => {
      const r = Number.parseInt(line.color.slice(1, 3), 16)
      const g = Number.parseInt(line.color.slice(3, 5), 16)
      const b = Number.parseInt(line.color.slice(5, 7), 16)
      const alpha = line.opacity / 100
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`

      const fontStyle = line.italic ? "italic" : "normal"
      const fontWeight = line.bold ? 700 : line.fontWeight
      ctx.font = `${fontStyle} ${fontWeight} ${line.fontSize}px ${line.oldFontFamily ?? line.fontFamily}`
      ctx.textAlign = "center"
      ctx.textBaseline = "top"

      const textX = canvas.width / 2
      const textY = currentY

      if (line.strokeWidth > 0) {
        ctx.strokeStyle = line.strokeColor
        ctx.lineWidth = line.strokeWidth
        ctx.strokeText(line.text, textX, textY)
      }
      ctx.fillText(line.text, textX, textY)

      currentY += lineHeights[index]
    })
  }

  const addTextLine = () => {
    const newLine: TextLine = {
      id: Date.now().toString(),
      text: "Nova linha",
      fontFamily: "Arial",
      oldFontFamily: "Arial",
      fontSize: 48,
      color: "#000000",
      fontWeight: 400,
      opacity: 100,
      italic: false,
      underline: false,
      bold: false,
      strikethrough: false,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowBlur: 0,
      shadowColor: "#000000",
      strokeWidth: 0,
      strokeColor: "#000000",
    }
    setTextLines([...textLines, newLine])
  }

  const removeTextLine = (id: string) => {
    if (textLines.length > 1) {
      setTextLines(textLines.filter((line) => line.id !== id))
    }
  }

  const updateTextLine = (id: string, property: keyof TextLine, value: string | number | boolean | null) => {
    setTextLines(textLines.map((line) => (line.id === id ? { ...line, [property]: value } : line)))
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "texto-customizado.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return {
    fonts,
    textLines,
    setTextLines,
    addTextLine,
    removeTextLine,
    updateTextLine,
    handleDownload,
    canvasRef
  }
}