import { Plus, Users, FolderOpen, Send, TrendingUp, FileText, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Link } from "react-router-dom"

export default function Dashboard() {
  const stats = [
    {
      title: "Active Clients",
      value: "24",
      description: "6 new this month",
      icon: Users,
      trend: "+12%"
    },
    {
      title: "Open Files",
      value: "18",
      description: "Across all streams",
      icon: FolderOpen,
      trend: "+5%"
    },
    {
      title: "Pending Forms",
      value: "7",
      description: "Awaiting completion",
      icon: Send,
      trend: "-3%"
    },
    {
      title: "Completion Rate",
      value: "92%",
      description: "Last 30 days",
      icon: TrendingUp,
      trend: "+8%"
    }
  ]

  const recentActivity = [
    {
      id: 1,
      client: "Sarah Chen",
      action: "Completed Work Permit intake",
      time: "2 hours ago",
      status: "completed"
    },
    {
      id: 2,
      client: "Michael Johnson",
      action: "Started PR application form",
      time: "4 hours ago",
      status: "in-progress"
    },
    {
      id: 3,
      client: "Elena Rodriguez",
      action: "Invited to complete Super Visa form",
      time: "1 day ago",
      status: "sent"
    },
    {
      id: 4,
      client: "David Kim",
      action: "File created for Express Entry",
      time: "2 days ago",
      status: "new"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground'
      case 'in-progress': return 'bg-warning text-warning-foreground'
      case 'sent': return 'bg-primary text-primary-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your immigration practice.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Client
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create File
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{stat.description}</span>
                <Badge variant="secondary" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your clients and staff
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity.client}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.action}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={activity.status as any} />
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FolderOpen className="h-4 w-4 mr-2" />
              Create Immigration File
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Send className="h-4 w-4 mr-2" />
              Send Intake Invitation
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <div className="pt-2 border-t border-border">
              <Link to="/invite-demo">
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Client Intake Demo
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}