import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'

import { getEvents } from '../../services/eventService'
import {
  getEventMembers,
  addEventMember
} from '../../services/eventMemberService'

import { getUsers } from '../../services/userService'

function TeamMembers() {
  const [events, setEvents] = useState([])
  const [users, setUsers] = useState([])
  const [members, setMembers] = useState([])

  const [showModal, setShowModal] = useState(false)

  const [selectedEventId, setSelectedEventId] = useState('')
  const [selectedUserId, setSelectedUserId] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState('')

  async function loadData() {
    try {
      setLoading(true)
      setError('')

      const [eventData, userData] = await Promise.all([
        getEvents(),
        getUsers()
      ])

      const eventList = Array.isArray(eventData)
        ? eventData
        : []

      const userList = Array.isArray(userData)
        ? userData
        : []

      setEvents(eventList)
      setUsers(userList)

      const allMembers = []

      for (const event of eventList) {
        try {
          const eventMembers = await getEventMembers(event.id)

          if (Array.isArray(eventMembers)) {
            eventMembers.forEach((member) => {
              allMembers.push({
                ...member,
                eventId: event.id,
                eventName: event.name
              })
            })
          }
        } catch (err) {
          console.error(
            `Failed to load members for event ${event.id}`,
            err
          )
        }
      }

      setMembers(allMembers)
    } catch (err) {
      console.error('Failed to load team members:', err)
      setError('Failed to load team members.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    async function load() {
      if (ignore) {
        return
      }

      await loadData()
    }

    load()

    return () => {
      ignore = true
    }
  }, [])

  const teamUsers = users.filter(
    (user) =>
      String(user.role ?? user.Role ?? '').toLowerCase() ===
      'team'
  )

  const userMap = new Map()

  users.forEach((user) => {
    const id = Number(user.id ?? user.Id)

    if (id) {
      userMap.set(id, user)
    }
  })

  async function handleAddMember(e) {
    e.preventDefault()

    if (!selectedEventId || !selectedUserId) {
      setError('Please select an event and team member.')
      return
    }

    try {
      setSaving(true)
      setError('')

      await addEventMember(
        selectedEventId,
        selectedUserId
      )

      setShowModal(false)
      setSelectedEventId('')
      setSelectedUserId('')

      await loadData()
    } catch (err) {
      console.error('Failed to add member:', err)

      const message =
        err?.response?.data?.message ||
        'Failed to add team member.'

      setError(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">

          {/* Header */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Team Members
              </h1>

              <p className="text-gray-600 mt-1">
                Manage photographers, editors and event team members.
              </p>
            </div>

            <button
              onClick={() => {
                setError('')
                setShowModal(true)
              }}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add Team Member
            </button>

          </div>

          {/* Error */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {/* Content */}

          <div className="bg-white rounded-xl shadow overflow-hidden">

            {loading ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">
                  Loading team members...
                </p>
              </div>
            ) : members.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-gray-500">
                  No team members have been assigned to events yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-4 font-semibold">
                        Member
                      </th>

                      <th className="text-left px-6 py-4 font-semibold">
                        Email
                      </th>

                      <th className="text-left px-6 py-4 font-semibold">
                        Event
                      </th>

                      <th className="text-left px-6 py-4 font-semibold">
                        Role
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {members.map((member, index) => {

                      const memberId = Number(
                        member.userId ??
                        member.UserId ??
                        member.user?.id ??
                        member.User?.Id ??
                        member.id
                      )

                      const user = userMap.get(memberId)

                      const name =
                        user?.name ??
                        user?.Name ??
                        member.user?.name ??
                        member.user?.Name ??
                        member.name ??
                        member.Name ??
                        'Unknown Member'

                      const email =
                        user?.email ??
                        user?.Email ??
                        member.user?.email ??
                        member.user?.Email ??
                        member.email ??
                        member.Email ??
                        '-'

                      const role =
                        user?.role ??
                        user?.Role ??
                        'Team'

                      return (
                        <tr
                          key={
                            member.id ??
                            `${member.eventId}-${memberId}-${index}`
                          }
                          className="border-b last:border-b-0 hover:bg-gray-50"
                        >

                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">
                              {name}
                            </p>

                            <p className="text-xs text-gray-400">
                              User ID: {memberId}
                            </p>
                          </td>

                          <td className="px-6 py-4 text-gray-600">
                            {email}
                          </td>

                          <td className="px-6 py-4">
                            <span className="font-medium">
                              {member.eventName || '-'}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                              {role}
                            </span>
                          </td>

                        </tr>
                      )
                    })}

                  </tbody>

                </table>

              </div>
            )}

          </div>

          {/* Add Member Modal */}

          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">

                <div className="flex items-center justify-between mb-6">

                  <h2 className="text-xl font-bold">
                    Add Team Member
                  </h2>

                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-800 text-xl"
                  >
                    ×
                  </button>

                </div>

                <form onSubmit={handleAddMember}>

                  {/* Event */}

                  <div className="mb-5">

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event
                    </label>

                    <select
                      value={selectedEventId}
                      onChange={(e) =>
                        setSelectedEventId(e.target.value)
                      }
                      className="w-full border rounded-lg px-4 py-3"
                      required
                    >
                      <option value="">
                        Select event
                      </option>

                      {events.map((event) => (
                        <option
                          key={event.id}
                          value={event.id}
                        >
                          {event.name}
                        </option>
                      ))}
                    </select>

                  </div>

                  {/* User */}

                  <div className="mb-6">

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Member
                    </label>

                    <select
                      value={selectedUserId}
                      onChange={(e) =>
                        setSelectedUserId(e.target.value)
                      }
                      className="w-full border rounded-lg px-4 py-3"
                      required
                    >
                      <option value="">
                        Select team member
                      </option>

                      {teamUsers.map((user) => (
                        <option
                          key={user.id ?? user.Id}
                          value={user.id ?? user.Id}
                        >
                          {user.name ?? user.Name} —{' '}
                          {user.email ?? user.Email}
                        </option>
                      ))}
                    </select>

                    {teamUsers.length === 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        No Team users are available.
                      </p>
                    )}

                  </div>

                  {/* Buttons */}

                  <div className="flex justify-end gap-3">

                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {saving ? 'Adding...' : 'Add Member'}
                    </button>

                  </div>

                </form>

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default TeamMembers