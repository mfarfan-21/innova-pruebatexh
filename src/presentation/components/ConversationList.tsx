import { Box, List, ListItemButton, ListItemText, Button, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ConversationListProps } from '../../domain/entities/ComponentInterfaces';

export const ConversationList = ({ conversations, selectedId, onSelect, onNew, onDelete }: ConversationListProps) => {
  return (
    <Box sx={{ width: 280, borderRight: 1, borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNew}
          sx={{ borderRadius: 2 }}
        >
          Nueva Conversación
        </Button>
      </Box>
      
      <List sx={{ flex: 1, overflow: 'auto', p: 1 }}>
        {conversations.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            No hay conversaciones
          </Typography>
        ) : (
          conversations.map((conv) => (
            <ListItemButton
              key={conv.id}
              selected={selectedId === conv.id}
              onClick={() => onSelect(conv.id)}
              sx={{ borderRadius: 1, mb: 0.5, pr: 0.5 }}
            >
              <ChatIcon sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
              <ListItemText
                primary={conv.title}
                secondary={new Date(conv.updatedAt).toLocaleDateString()}
                primaryTypographyProps={{ noWrap: true }}
              />
              {onDelete && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                  sx={{ ml: 0.5 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </ListItemButton>
          ))
        )}
      </List>
    </Box>
  );
};
