import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { cn } from '@/lib/cn'

type Props = React.ComponentProps<typeof Card> & { ring?: boolean }
export function RecursiveCard({ className, ring=true, ...props }: Props){
  return (
    <Card {...props} className={cn('gen-ring gen-blueprint gen-fractal-lattice anim-zoom', ring && 'anim-ring', className)} />
  )
}
export { CardHeader, CardContent, CardTitle }
