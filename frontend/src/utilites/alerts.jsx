export function InvalidAlert({text}) {
    return (
        <div className="text-center p-2 mb-4 text-lg text-red-800 rounded-lg bg-inhert dark:text-red-400" role="alert">
            <span className="font-medium">{text}</span>
        </div>
    )
}


export function InvalidField({text}){
    return (
        <div className="mb-1 ml-2 mt-1 text-sm text-red-800 rounded-lg bg-inhert dark:text-red-400" role="alert">
            <span className="font-medium">{text}</span>
        </div>
    )
}
