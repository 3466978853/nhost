import { useDialog } from '@/components/common/DialogProvider';
import Chip from '@/ui/v2/Chip';
import Divider from '@/ui/v2/Divider';
import { Dropdown } from '@/ui/v2/Dropdown';
import IconButton from '@/ui/v2/IconButton';
import DotsVerticalIcon from '@/ui/v2/icons/DotsVerticalIcon';
import TrashIcon from '@/ui/v2/icons/TrashIcon';
import UserIcon from '@/ui/v2/icons/UserIcon';
import List from '@/ui/v2/List';
import { ListItem } from '@/ui/v2/ListItem';
import Text from '@/ui/v2/Text';

import { Avatar } from '@mui/material';
import { format, formatRelative } from 'date-fns';
import Image from 'next/image';
import type { RemoteAppUser } from 'pages/[workspaceSlug]/[appSlug]/users';
import { Fragment } from 'react';

export interface UsersBodyProps {
  /**
   * Users
   */
  users?: RemoteAppUser[];
  /**
   * Function to delete a user
   */
  onDeleteUser?: (user: RemoteAppUser) => Promise<void>;
  /**
   * Function to edit a user
   */
  onEditUser?: VoidFunction;
}

export default function UsersBody({
  users,
  onDeleteUser,
  onEditUser,
}: UsersBodyProps) {
  const { openDrawer } = useDialog();

  function handleViewUser(user: RemoteAppUser) {
    openDrawer('EDIT_USER', {
      title: 'User Details',
      payload: { user, onEditUser },
    });
  }

  return (
    <div className="grid grid-flow-row gap-2">
      <div className="grid grid-flow-row">
        <div className="grid grid-cols-4 gap-2 px-3 py-3 border-gray-200 lg:grid-cols-4 border-b-1">
          <Text className="font-medium">Name</Text>
          <Text className="font-medium">Signed up at</Text>
          <Text className="font-medium">Last Seen</Text>
          <Text className="font-medium">Sign In Methods</Text>
        </div>
        <List>
          {users?.map((user) => (
            <Fragment key={user.id}>
              <ListItem.Root
                // className="grid items-center grid-cols-4 gap-2 px-3 py-3 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none motion-safe:transition-colors"
                className="grid items-center grid-cols-4 gap-2 py-2.5 cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:outline-none motion-safe:transition-colors"
                secondaryAction={
                  <Dropdown.Root>
                    <Dropdown.Trigger
                      asChild
                      hideChevron
                      className="absolute -translate-y-1/2 right-1 top-1/2"
                    >
                      <IconButton variant="borderless" color="secondary">
                        <DotsVerticalIcon />
                      </IconButton>
                    </Dropdown.Trigger>

                    <Dropdown.Content
                      menu
                      PaperProps={{ className: 'w-32' }}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <Dropdown.Item
                        onClick={() => handleViewUser(user)}
                        className="grid grid-flow-col items-center gap-2 p-2 text-sm+ font-medium"
                      >
                        <UserIcon className="w-4 h-4" />
                        <Text className="font-medium">View User</Text>
                      </Dropdown.Item>

                      <Divider component="li" />

                      <Dropdown.Item
                        className="grid grid-flow-col items-center gap-2 p-2 text-sm+ font-medium text-red"
                        onClick={() => onDeleteUser(user)}
                      >
                        <TrashIcon className="w-4 h-4" />
                        <Text className="font-medium text-red">Delete</Text>
                      </Dropdown.Item>

                      <Divider component="li" />
                    </Dropdown.Content>
                  </Dropdown.Root>
                }
              >
                <ListItem.Button onClick={() => handleViewUser(user)}>
                  <div className="grid grid-flow-col gap-3 place-content-start">
                    {!user.avatarUrl.includes('default=blank') ? (
                      <Avatar src={user.avatarUrl} />
                    ) : (
                      <Avatar className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-300 rounded-full">
                        <span className="text-xs font-medium text-gray-600 uppercase">
                          {user.displayName.slice(0, 2)}
                        </span>
                      </Avatar>
                    )}
                    <div className="grid items-center grid-flow-row">
                      <Text className="text-sm+ font-medium">
                        {user.displayName}
                      </Text>
                      <Text className="font-normal text-greyscaleGreyDark">
                        {user.email}
                      </Text>
                    </div>
                  </div>
                </ListItem.Button>
                <ListItem.Button onClick={() => handleViewUser(user)}>
                  <Text
                    color="greyscaleDark"
                    className="font-normal"
                    size="normal"
                  >
                    {format(new Date(user.createdAt), 'd MMM yyyy')}
                  </Text>
                </ListItem.Button>
                <ListItem.Button onClick={() => handleViewUser(user)}>
                  {user.lastSeen
                    ? formatRelative(new Date(), new Date(user.lastSeen))
                    : 'Never'}
                </ListItem.Button>
                <ListItem.Button>
                  <Chip
                    component="span"
                    color="default"
                    size="small"
                    label="Email & Password"
                    sx={{
                      paddingLeft: '0.55rem',
                    }}
                    icon={
                      <Image
                        src="/assets/Envelope.svg"
                        width={16}
                        height={16}
                      />
                    }
                  />
                </ListItem.Button>
              </ListItem.Root>

              <Divider component="li" />
            </Fragment>
          ))}
        </List>
      </div>
    </div>
  );
}
