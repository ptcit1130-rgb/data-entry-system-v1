import { Link } from "@inertiajs/react";
import {
    BookOpen,
    FolderGit2,
    LayoutGrid,
    NotebookTabs,
    ListStart,
    BriefcaseBusiness,
    UserCog,
    Warehouse,
    ChartCandlestick,
    ReceiptTextIcon
} from "lucide-react";
import AppLogo from "@/components/app-logo";
import { NavFooter } from "@/components/nav-footer";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { dashboard } from "@/routes";
import type { NavItem } from "@/types";
import { index as productCategoryIndex } from "@/routes/product-categories";
import { index as productItemIndex } from "@/routes/product-items";
import { index as specialistIndex } from "@/routes/specialists";
import { index as businessPartnerIndex } from "@/routes/business-partners";
import { index as tenantBranchIndex } from "@/routes/tenant-branches";
import { index as stockInIndex } from "@/routes/stock-ins";
import { index as stockOutIndex} from "@/routes/stock-outs";

const mainNavItems: NavItem[] = [
    {
        title: "Dashboard",
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: "Tenant Branch",
        href: tenantBranchIndex(),
        icon: Warehouse,
    },
    {
        title: "Product Category",
        href: productCategoryIndex(),
        icon: NotebookTabs,
    },
    {
        title: "Product Item",
        href: productItemIndex(),
        icon: ListStart,
    },
    {
        title: "Distributor Specialist",
        href: specialistIndex(),
        icon: UserCog,
    },
    {
        title: "Business Partner",
        href: businessPartnerIndex(),
        icon: BriefcaseBusiness,
    },
    {
        title: "Stock In",
        href: stockInIndex(),
        icon: ChartCandlestick,
    },
    {
        title: "Stock Out",
        href: stockOutIndex(),
        icon: ReceiptTextIcon,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: "Repository",
        href: "https://github.com/laravel/react-starter-kit",
        icon: FolderGit2,
    },
    {
        title: "Documentation",
        href: "https://laravel.com/docs/starter-kits#react",
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
