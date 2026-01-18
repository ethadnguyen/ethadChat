import authService from '../services/authService.js';
import { setRefreshTokenCookie, clearRefreshTokenCookie } from '../utils/cookie.util.js';

export const signup = async (req, res, next) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;
        await authService.signup({ username, email, password, firstName, lastName });
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const { accessToken, refreshToken } = await authService.signin(username, password);
        
        setRefreshTokenCookie(res, refreshToken);
        
        return res.status(200).json({
            message: "Đăng nhập thành công",
            accessToken: accessToken
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        await authService.logout(refreshToken);
        
        clearRefreshTokenCookie(res);
        
        return res.status(200).json({
            message: "Đăng xuất thành công"
        });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        const { accessToken } = await authService.refreshAccessToken(refreshToken);
        
        return res.status(200).json({
            accessToken: accessToken
        });
    } catch (error) {
        next(error);
    }
};

