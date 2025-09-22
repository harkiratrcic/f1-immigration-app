import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: 'active' | 'pending' | 'inactive' | 'completed' | 'in-progress' | 'sent' | 'draft'
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return {
          variant: 'default' as const,
          className: 'bg-success text-success-foreground hover:bg-success/80'
        }
      case 'pending':
      case 'in-progress':
        return {
          variant: 'default' as const,
          className: 'bg-warning text-warning-foreground hover:bg-warning/80'
        }
      case 'sent':
        return {
          variant: 'default' as const,
          className: 'bg-primary text-primary-foreground hover:bg-primary/80'
        }
      case 'draft':
        return {
          variant: 'secondary' as const,
          className: 'bg-muted text-muted-foreground hover:bg-muted/80'
        }
      case 'inactive':
      default:
        return {
          variant: 'secondary' as const,
          className: 'bg-muted text-muted-foreground hover:bg-muted/80'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}