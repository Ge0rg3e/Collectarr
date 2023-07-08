// Dependencies
import { createBrowserRouter } from 'react-router-dom';
import NotFound from '@pages/notFound';
import Library from '@pages/library';
import Search from '@pages/search';
import Login from '@pages/login';
import Home from '@pages/home';
import Post from '@pages/post';
import Account from '@/pages/account';

export default createBrowserRouter([
	{
		path: '/',
		element: <Home />
	},
	{
		path: '/search/:content',
		element: <Search />
	},
	{
		path: '/library/:id',
		element: <Library />
	},
	{
		path: '/post/:id',
		element: <Post />
	},
	{
		path: '/login',
		element: <Login />
	},
	{
		path: '/account',
		element: <Account />
	},
	{
		path: '*',
		element: <NotFound />
	}
]);
