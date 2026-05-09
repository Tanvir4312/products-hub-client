import { NavSection } from "@/types/navItems.types"
import { getDefaultDashboardRoute, UserRole } from "./authUtils"


export const commonNavItems = (role: UserRole): NavSection[] => {
    const defaulDashboard = getDefaultDashboardRoute(role)
    return [
        {
            title: "Dashboard",
            items: [
                {
                    title: "Home",
                    href: "/",
                    icon: "HomeIcon"
                },
                {
                    title: "Dashboard",
                    href: defaulDashboard,
                    icon: "LayoutDashboardIcon"
                },
                {
                    title: "My Profile",
                    href: "/my-profile",
                    icon: "UserIcon"
                }
            ]
        },
        {
            title: "Settings",
            items: [
                {
                    title: "change password",
                    href: "/change-password",
                    icon: "LockIcon"
                }
            ]

        }
    ]
}

export const adminNavItems: NavSection[] = [
    {
        title: "User Management",
        items: [
            {
                title: "All Users",
                href: "/admin/dashboard/allUsers-managements",
                icon: "UserIcon"
            },
            {
                title: "Admins",
                href: "/admin/dashboard/admins-managements",
                icon: "UserIcon"
            },
            {
                title: "Moderators",
                href: "/admin/dashboard/moderators-managements",
                icon: "UserIcon"
            },
            {
                title: "Users",
                href: "/admin/dashboard/users-managements",
                icon: "UserIcon"
            },
        ]
    },
    {
        title: "Product Management",
        items: [
            {
                title: "All Products",
                href: "/admin/dashboard/products",
                icon: "PackageIcon"
            },
            {
                title: "Pending Products",
                href: "/admin/dashboard/pending-products",
                icon: "ClockIcon"
            },
            {
                title: "Featured Products",
                href: "/admin/dashboard/featured-products",
                icon: "StarIcon"
            },
            {
                title: "Reported Products",
                href: "/admin/dashboard/reported-products",
                icon: "FlagIcon"
            },
        ]
    },
    {
        title: "Tags & Coupons",
        items: [
            {
                title: "Tags Management",
                href: "/admin/dashboard/tags-managements",
                icon: "TagIcon"
            },
            {
                title: "Coupons Management",
                href: "/admin/dashboard/coupons-managements",
                icon: "TicketIcon"
            },
        ]
    },
    {
        title: "Reviews & Feedback",
        items: [
            {
                title: "Reviews",
                href: "/admin/dashboard/reviews",
                icon: "MessageSquareIcon"
            },
            {
                title: "Top Voted Products",
                href: "/admin/dashboard/top-voted-products",
                icon: "TrendingUpIcon"
            },
            {
                title: "Reports",
                href: "/admin/dashboard/reports",
                icon: "AlertTriangleIcon"
            }
        ]
    }
]

export const moderatorNavItems: NavSection[] = [
    {
        title: "Product Management",
        items: [

            {
                title: "Product Review Queue",
                href: "/moderator/dashboard/products-review-queue",
                icon: "FileTextIcon"
            },
            {
                title: "Reported Products",
                href: "/moderator/dashboard/reported-products",
                icon: "FileTextIcon"
            },

        ]
    },
    {
        title: "Reviews & Feedback",
        items: [
            {
                title: "Reviews",
                href: "/moderator/dashboard/reviews",
                icon: "MessageSquareIcon"
            },
            {
                title: "Top Voted Products",
                href: "/moderator/dashboard/top-voted-products",
                icon: "TrendingUpIcon"
            },
            {
                title: "Reports",
                href: "/moderator/dashboard/reports",
                icon: "AlertTriangleIcon"
            }
        ]
    }

]

export const userNavItems: NavSection[] = [
    {
        title: "Products",
        items: [
            {
                title: "Add Product",
                href: "/user/dashboard/add-product",
                icon: "PlusCircleIcon"
            },
            {
                title: "My Products",
                href: "/user/dashboard/my-products",
                icon: "FileTextIcon"
            },
            {
                title: "My Reviews",
                href: "/user/dashboard/my-reviews",
                icon: "FileTextIcon"
            },
            {
                title: "Liked Products",
                href: "/user/dashboard/upvoted-products",
                icon: "ThumbsUpIcon"
            }

        ]
    },
    {
        title: "Payments",
        items: [
            {
                title: "My Subscriptions",
                href: "/user/dashboard/my-subscription",
                icon: "CreditCardIcon"
            }
        ]
    }
]

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
    const commonItems = commonNavItems(role)

    switch (role) {
        case "SUPER_ADMIN":
        case "ADMIN":
            return [...commonItems, ...adminNavItems]

        case "MODERATOR":
            return [...commonItems, ...moderatorNavItems]

        case "USER":
            return [...commonItems, ...userNavItems]
        default:
            return commonItems || [];
    }
}
