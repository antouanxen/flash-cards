export function turnToNull(deleted_at: string | Date | null): Date | null {
    if (typeof deleted_at === null || deleted_at === 'null') { 
    return null
    } else if (typeof deleted_at === 'string') {
        const DeletedAtDate = new Date(deleted_at)
        return isNaN(DeletedAtDate.getTime()) ? null : DeletedAtDate
    }
   return deleted_at
}