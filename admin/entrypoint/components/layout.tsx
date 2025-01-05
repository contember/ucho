export const Layout = ({ children }: { children?: React.ReactNode }) => (
	<div className="grid md:grid-cols-2 min-h-screen ">
		<div className="bg-gray-100 p-4 flex items-center justify-center">
			{children}
		</div>
		<div className="bg-gray-900 text-white p-4 flex items-center justify-center">
			<div className="w-full max-w-md">
				<div className="text-center text-2xl">Welcome to Contember Echo</div>
			</div>
		</div>
	</div>
)
