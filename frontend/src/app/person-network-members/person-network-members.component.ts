import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NetworkMemberModel } from '../models/network-member.model';
import { ConfirmService } from '../confirm.service';
import { NetworkMemberService } from '../network-member.service';
import { switchMap, tap } from 'rxjs/operators';
import { PersonModel } from '../models/person.model';
import { NETWORK_MEMBER_TYPE_TRANSLATIONS } from '../display-network-member-type.pipe';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NetworkMemberCommand } from '../models/network-member.command';
import { Observable } from 'rxjs';

@Component({
  selector: 'gl-person-network-members',
  templateUrl: './person-network-members.component.html',
  styleUrls: ['./person-network-members.component.scss']
})
export class PersonNetworkMembersComponent implements OnInit {

  members: Array<NetworkMemberModel>;
  person: PersonModel;
  memberTypes = NETWORK_MEMBER_TYPE_TRANSLATIONS.map(t => t.key);

  editedMember: NetworkMemberModel;
  memberForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private confirmService: ConfirmService,
              private networkMemberService: NetworkMemberService,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.members = this.route.snapshot.data.members;
    this.person = this.route.snapshot.parent.data.person;
  }

  delete(member: NetworkMemberModel) {
    this.confirmService.confirm({
      message: 'Voulez-vous vraiment supprimer ce membre de réseau\u00a0?'
    }).pipe(
      switchMap(() => this.networkMemberService.delete(this.person.id, member.id)),
      switchMap(() => this.networkMemberService.list(this.person.id)),
    ).subscribe(members => this.members = members, () => {});
  }

  showMemberEdition(member: NetworkMemberModel | null) {
    this.editedMember = member;
    this.memberForm = this.fb.group({
      type: [member ? member.type : null, Validators.required],
      text: [member ? member.text : null, Validators.required]
    });
  }

  cancelMemberEdition() {
    this.editedMember = null;
    this.memberForm = null;
  }

  save() {
    if (this.memberForm.invalid) {
      return;
    }

    const command: NetworkMemberCommand = this.memberForm.value;
    const observable: Observable<void | NetworkMemberModel> = this.editedMember
      ? this.networkMemberService.update(this.person.id, this.editedMember.id, command)
      : this.networkMemberService.create(this.person.id, command);

    observable.pipe(
      tap(() => this.cancelMemberEdition()),
      switchMap(() => this.networkMemberService.list(this.person.id)),
    ).subscribe(members => this.members = members);
  }
}
