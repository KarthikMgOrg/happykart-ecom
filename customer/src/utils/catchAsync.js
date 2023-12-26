export async function catchAsync(fn) {
    return async (req, res, next) => {
        try {
            const res = await fn(req, res, next)
            res.locals.data = res
            next()
        } catch (error) {
            next(error.message)
        }
    }
}