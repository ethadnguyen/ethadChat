import userService from '../services/userService.js';

export const authMe = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.user._id);
        return res.status(200).json({
            message: "Lấy thông tin user thành công",
            user: user
        });
    } catch (error) {
        next(error);
    }
};

export const test = async (req, res) => {
    return res.sendStatus(204);
};

