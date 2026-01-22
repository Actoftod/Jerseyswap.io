# Deployment Guide for Hostinger

## Prerequisites
1. Hostinger hosting account with Node.js support
2. Google Gemini API key
3. FTP/SFTP access or Git deployment enabled

## Build Process
1. Install dependencies: `npm install`
2. Set environment variables in Hostinger panel or create `.env` file
3. Build the app: `npm run build`
4. Upload `dist/` folder contents to `public_html/`

## Environment Variables (Set in Hostinger Panel or .env file)
- `VITE_API_KEY`: Your Google Gemini API key
- `VITE_ADMIN_EMAIL`: Admin email for authentication
- `VITE_ADMIN_PASSWORD`: Admin password for authentication
- `VITE_APP_URL`: Production URL (e.g., https://jerseyswap.io)

**Important**: These variables must be set during the build process. For Hostinger:
1. Set them as environment variables in the Node.js hosting panel before building
2. Or create a `.env` file locally before running `npm run build`
3. Never commit the `.env` file to Git - use `.env.example` as a template

## Post-Deployment Checklist
- [ ] Verify .htaccess is working
- [ ] Test SPA routing (refresh on different routes)
- [ ] Check all assets load correctly
- [ ] Test mobile responsiveness
- [ ] Verify API connections work
- [ ] Test authentication flow
- [ ] Check console for errors
- [ ] Verify HTTPS is working
- [ ] Test all major features (upload, swap, save, share)

## Deployment Steps for Hostinger

### Option 1: FTP/SFTP Upload
1. Build the project locally: `npm run build`
2. Connect to your Hostinger account via FTP/SFTP
3. Upload all files from the `dist/` folder to `public_html/`
4. Ensure `.htaccess` is uploaded and properly configured
5. Test the application

### Option 2: Git Deployment (if enabled)
1. Push your code to a Git repository
2. Connect Hostinger to your Git repository
3. Set environment variables in Hostinger panel
4. Run build command in Hostinger terminal: `npm install && npm run build`
5. Configure web server to serve from `dist/` directory

## Troubleshooting

### SPA Routing Not Working
- Verify `.htaccess` file is present in `public_html/`
- Check that mod_rewrite is enabled on your hosting
- Ensure base path in `vite.config.ts` is set to `'./'`

### API Not Working
- Verify environment variables are set correctly
- Check browser console for API key errors
- Ensure Google Gemini API key is valid and has proper permissions

### Assets Not Loading
- Check that all files from `dist/` are uploaded
- Verify file permissions (644 for files, 755 for directories)
- Check browser console for 404 errors

### Build Errors
- Ensure Node.js version is compatible (v18 or higher recommended)
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check TypeScript errors: `npm run build`

## Performance Optimization Tips
- Enable Cloudflare on Hostinger for CDN and additional caching
- Use Hostinger's built-in caching features
- Enable Gzip compression (already configured in .htaccess)
- Monitor Google Lighthouse scores for optimization opportunities

## Security Notes
- Never commit `.env` file to version control
- Use strong admin passwords
- Regularly update dependencies: `npm update`
- Monitor for security vulnerabilities: `npm audit`
- Keep API keys secure and rotate them periodically

## Support
For issues specific to Hostinger hosting, contact Hostinger support.
For application issues, refer to the repository documentation.
