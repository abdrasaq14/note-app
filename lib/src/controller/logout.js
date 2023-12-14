"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCookieOnLogout = void 0;
function clearCookieOnLogout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        else {
            // this will redirect to the homepage
            res.redirect('/');
        }
        // Redirect to the login page or any other desired page
    });
}
exports.clearCookieOnLogout = clearCookieOnLogout;
