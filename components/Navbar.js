// components/Navbar.js
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Fragment, useContext } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AuthContext } from "../context/AuthContext";

const adminNavigation = [
	{ name: "Home", href: "/" },
	{ name: "Add Debt", href: "/add-debt" },
	{ name: "Tracker", href: "/tracker" },
	{ name: "History", href: "/history" },
];

const userNavigation = [{ name: "Tracker", href: "/tracker" }];

function classNames(...classes) {
	return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
	const { isLoggedIn, user, logout } = useContext(AuthContext);
	const router = useRouter();

	const handleLinkClick = (href) => {
		if (href === "/") {
			if (isLoggedIn) {
				user?.userType === "Administrator" ? router.push(href) : router.push("/tracker");
			} else {
				router.push("/landing");
			}
		} else {
			isLoggedIn ? router.push(href) : router.push("/login");
		}
	};

	return (
		<Disclosure as="nav" className="bg-gray-900 fixed w-full z-10 top-0">
			{({ open }) => (
				<>
					<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
						<div className="relative flex h-16 items-center justify-between">
							<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
								<Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
									<span className="sr-only">Open main menu</span>
									{open ? (
										<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
									) : (
										<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
									)}
								</Disclosure.Button>
							</div>
							<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
								<div className="flex flex-shrink-0 items-center">
									<Link
										href={
											isLoggedIn
												? user?.userType === "Administrator"
													? "/"
													: "/tracker"
												: "/landing"
										}
										legacyBehavior
									>
										<a className="text-white text-lg font-bold cursor-pointer">
											<img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
										</a>
									</Link>
								</div>
								{isLoggedIn && (
									<div className="hidden sm:ml-6 sm:block">
										<div className="flex space-x-4">
											{(user?.userType === "Administrator"
												? adminNavigation
												: userNavigation
											).map((item) => (
												<a
													key={item.name}
													onClick={() => handleLinkClick(item.href)}
													className={classNames(
														router.pathname === item.href
															? "bg-gray-800 text-white"
															: "text-gray-300 hover:bg-gray-800 hover:text-white",
														"rounded-md px-3 py-2 text-sm font-medium cursor-pointer"
													)}
													aria-current={router.pathname === item.href ? "page" : undefined}
												>
													{item.name}
												</a>
											))}
										</div>
									</div>
								)}
							</div>
							{isLoggedIn && (
								<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
									<button
										type="button"
										className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
									>
										<span className="sr-only">View notifications</span>
										<BellIcon className="h-6 w-6" aria-hidden="true" />
									</button>
									<Menu as="div" className="relative ml-3">
										<div>
											<Menu.Button className="flex rounded-full bg-gray-900 text-sm focus:outline-none">
												<span className="sr-only">Open user menu</span>
												<span className="text-white">{user?.name}</span>
											</Menu.Button>
										</div>
										<Transition
											as={Fragment}
											enter="transition ease-out duration-100"
											enterFrom="transform opacity-0 scale-95"
											enterTo="transform opacity-100 scale-100"
											leave="transition ease-in duration-75"
											leaveFrom="transform opacity-100 scale-100"
											leaveTo="transform opacity-0 scale-95"
										>
											<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-white ring-opacity-10 focus:outline-none">
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? "bg-gray-700" : "",
																"block px-4 py-2 text-sm text-gray-100"
															)}
														>
															Profile
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a
															href="/forgot-password"
															className={classNames(
																active ? "bg-gray-700" : "",
																"block px-4 py-2 text-sm text-gray-100"
															)}
														>
															Forgot Password
														</a>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															onClick={logout}
															className={classNames(
																active ? "bg-gray-700" : "",
																"block px-4 py-2 text-sm text-gray-100"
															)}
														>
															Logout
														</a>
													)}
												</Menu.Item>
											</Menu.Items>
										</Transition>
									</Menu>
								</div>
							)}
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden">
						{isLoggedIn && (
							<div className="space-y-1 px-2 pb-3 pt-2">
								{(user?.userType === "Administrator" ? adminNavigation : userNavigation).map((item) => (
									<Disclosure.Button
										key={item.name}
										as="a"
										onClick={() => handleLinkClick(item.href)}
										className={classNames(
											router.pathname === item.href
												? "bg-gray-800 text-white"
												: "text-gray-300 hover:bg-gray-800 hover:text-white",
											"block rounded-md px-3 py-2 text-base font-medium cursor-pointer"
										)}
										aria-current={router.pathname === item.href ? "page" : undefined}
									>
										{item.name}
									</Disclosure.Button>
								))}
							</div>
						)}
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
};

export default Navbar;
