import { ParentComponent, createContext, useContext } from 'solid-js'
import { useDrawingHandlers } from '../hooks/useDrawingHandlers'
import { DrawingState, useDrawingState } from '../hooks/useDrawingState'
import { useFeedback } from './FeedbackContext'
import { useWidget } from './WidgetContext'

interface DrawingContextValue {
	state: DrawingState
	handlers: {
		handleMouseDown: (e: MouseEvent) => void
		handleMouseMove: (e: MouseEvent) => void
		handleMouseUp: () => void
		handleShapeClick: (shapeId: string) => void
	}
}

const DrawingContext = createContext<DrawingContextValue>()

export const DrawingProvider: ParentComponent = props => {
	const { primaryColor } = useWidget()
	const { setScreenshot, setIsCapturing } = useFeedback()
	const state = useDrawingState()

	const handlers = useDrawingHandlers({
		...state,
		primaryColor,
		setScreenshot,
		setIsCapturing,
	})

	const value: DrawingContextValue = {
		state,
		handlers,
	}

	return <DrawingContext.Provider value={value}>{props.children}</DrawingContext.Provider>
}

export const useDrawing = () => {
	const context = useContext(DrawingContext)
	if (!context) {
		throw new Error('useDrawing must be used within a DrawingProvider')
	}
	return context
}
