import { Box, List, ListItemButton, ListItemText, Button, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import type { ConversationListProps } from '../../domain/entities/ComponentInterfaces';

export const ConversationList = ({ conversations, selectedId, onSelect, onNew, onDelete }: ConversationListProps) => {
  return (
    <Box sx={{ 
      width: 280, 
      borderRight: '0.5px solid rgba(0, 0, 0, 0.1)', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'white'
    }}>
      <Box sx={{ 
        p: 2, 
        borderBottom: '0.5px solid rgba(0, 0, 0, 0.1)',
        background: '#fafafa'
      }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNew}
          sx={{ 
            borderRadius: '8px',
            background: '#009ece',
            boxShadow: 'none',
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            py: 1,
            '&:hover': {
              background: '#0088b8',
              boxShadow: 'none'
            }
          }}
        >
          Nueva Conversación
        </Button>
      </Box>
      
      <List sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 1.5,
        '&::-webkit-scrollbar': {
          width: '6px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#d2d2d7',
          borderRadius: '3px'
        }
      }}>
        {conversations.length === 0 ? (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              p: 2, 
              textAlign: 'center',
              fontSize: '0.8125rem'
            }}
          >
            No hay conversaciones
          </Typography>
        ) : (
          conversations.map((conv) => (
            <ListItemButton
              key={conv.id}
              selected={selectedId === conv.id}
              onClick={() => onSelect(conv.id)}
              sx={{ 
                borderRadius: '8px', 
                mb: 0.5, 
                pr: 1,
                pl: 1.5,
                py: 1,
                minHeight: '60px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  background: '#f5f5f7'
                },
                '&.Mui-selected': {
                  background: '#e8f4f8',
                  '&:hover': {
                    background: '#e0f0f6'
                  }
                }
              }}
            >
              <ChatIcon sx={{ 
                mr: 1.5, 
                fontSize: 18, 
                color: selectedId === conv.id ? '#009ece' : '#999',
                flexShrink: 0
              }} />
              <ListItemText
                primary={conv.title}
                secondary={new Date(conv.updatedAt).toLocaleDateString()}
                primaryTypographyProps={{ 
                  noWrap: true,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: selectedId === conv.id ? '#1d1d1f' : '#3b3b3b'
                }}
                secondaryTypographyProps={{
                  fontSize: '0.75rem',
                  color: '#8e8e93'
                }}
                sx={{ 
                  my: 0,
                  overflow: 'hidden'
                }}
              />
              {onDelete && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(conv.id);
                  }}
                  sx={{ 
                    ml: 0.5,
                    flexShrink: 0,
                    opacity: 0.6,
                    transition: 'opacity 0.2s ease',
                    '&:hover': {
                      opacity: 1,
                      background: 'rgba(229, 31, 74, 0.1)'
                    }
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 16, color: '#e51f4a' }} />
                </IconButton>
              )}
            </ListItemButton>
          ))
        )}
      </List>
    </Box>
  );
};
